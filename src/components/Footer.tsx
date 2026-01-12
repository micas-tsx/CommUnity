'use client'

import { Bug, Heart } from "lucide-react"
import Link from "next/link"

export const Footer = () => {
  const whatsappNumber = "5561994060294"
  const bugReportMessage = encodeURIComponent("Olá! Encontrei um bug no CommUnity:\n\n[Descreva o problema aqui]")
  const whatsappBugLink = `https://wa.me/${whatsappNumber}?text=${bugReportMessage}`

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-32 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">CommUnity</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Conectando vizinhos, fortalecendo a comunidade. Um espaço para pedidos e ofertas entre moradores.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-brand transition-colors text-sm"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link 
                  href="/create-favor" 
                  className="text-gray-600 hover:text-brand transition-colors text-sm"
                >
                  Criar Anúncio
                </Link>
              </li>
              <li>
                <Link 
                  href="/perfil" 
                  className="text-gray-600 hover:text-brand transition-colors text-sm"
                >
                  Meu Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Suporte</h3>
            <a
              href={whatsappBugLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors text-sm mb-3"
            >
              <Bug size={16} />
              <span>Reportar Bug</span>
            </a>
            <p className="text-gray-500 text-xs mt-4">
              Encontrou um problema? Clique acima para reportar via WhatsApp.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              {currentYear} CommUnity. Feito com <Heart size={14} className="inline text-brand" /> para a comunidade.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 text-sm">Versão 1.1</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}