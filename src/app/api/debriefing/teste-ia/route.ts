import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { dados } = await request.json();

    // Dados para análise de empresa
    const dadosCompletos = {
      nomeEmpresa: dados.nomeEmpresa,
      cidadeEstado: dados.cidadeEstado
    };

    // Fazer chamada para o backend
    const backendResponse = await fetch('http://localhost:3001/api/debriefing/teste-ia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ respostas: dadosCompletos }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const backendData = await backendResponse.json();
    
    return NextResponse.json({
      success: true,
      resposta: backendData.resposta || backendData.diagnostico || 'Resposta da IA não disponível'
    });

  } catch (error) {
    console.error('Erro no teste da IA:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao testar a IA',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 