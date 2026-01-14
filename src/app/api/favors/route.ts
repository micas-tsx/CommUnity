import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, category, type, user_id, user_name } = body

    if (!title || !type || !category) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('erro nas notificações')
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Insere o favor usando a chave de serviço
    const { data: favor, error: insertError } = await supabaseAdmin
      .from('favors')
      .insert([
        {
          title: title.trim(),
          description: description?.trim() || null,
          category,
          type,
          user_name,
          user_id,
        },
      ])
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao inserir favor:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Buscar emails dos usuários via admin API (service role)
    let emails: string[] = []
    try {
      const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      if (usersError) {
        console.warn('Erro ao listar usuários do auth:', usersError)
      } else if (users && users.users) {
        emails = (users.users || []).map((u: any) => u.email).filter(Boolean)
      }
    } catch (e) {
      console.warn('Erro ao obter usuários auth.admin.listUsers:', e)
    }

    // fallback: tentar buscar coluna email em profiles (caso esteja presente)
    if (emails.length === 0) {
      try {
        const { data: profiles, error: profilesError } = await supabaseAdmin
          .from('profiles')
          .select('email')
          .not('email', 'is', null)
        if (profilesError) {
          console.warn('Erro ao buscar emails dos perfis (fallback):', profilesError)
        } else {
          emails = (profiles || []).map((p: any) => p.email).filter(Boolean)
        }
      } catch (e) {
        console.warn('Erro no fallback de profiles:', e)
      }
    }

    console.log(`Encontrados ${emails.length} emails para notificação`)

    if (emails.length > 0) {
      const RESEND_KEY = process.env.RESEND_API_KEY
      if (!RESEND_KEY) {
        console.warn('RESEND_API_KEY não configurada — pulando envio de emails')
      } else {
        
        const resend = new Resend(RESEND_KEY)

        let from = (process.env.EMAIL_FROM || 'noreply@community.com').replace(/^'+|'+$/g, "").replace(/^\"+|\"+$/g, "")
        const subject = `Novo favor criado: ${favor.title}`
        const html = `
          <h1>Novo Favor na CommUnity</h1>
          <p><strong>${favor.user_name}</strong> criou um novo favor:</p>
          <p><strong>Título:</strong> ${favor.title}</p>
          <p><strong>Descrição:</strong> ${favor.description || 'Nenhuma descrição fornecida'}</p>
          <p><strong>Categoria:</strong> ${favor.category}</p>
          <p><strong>Tipo:</strong> ${favor.type === 'OFFER' ? 'Oferta' : 'Pedido'}</p>
          <p>Abra o app para ver mais detalhes.</p>
        `

        // Enviar em lotes de 100 para evitar limites
        const batchSize = 100
        for (let i = 0; i < emails.length; i += batchSize) {
          const batch = emails.slice(i, i + batchSize)
          try {
            console.log(`Enviando ${batch.length} emails (batch ${i / batchSize + 1}) para Resend, from=${from}`)
            const result = await resend.emails.send({
              from,
              to: batch,
              subject,
              html,
            })
            console.log('Resultado Resend:', result)
          } catch (err: any) {
            // Log detalhado para ajudar debug
            console.error('Erro ao enviar batch de emails:', err?.message || err)
            if (err?.response) {
              try {
                const text = await err.response.text()
                console.error('Erro (response body):', text)
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ favor }, { status: 201 })
  } catch (err) {
    console.error('Erro interno na rota /api/favors:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}