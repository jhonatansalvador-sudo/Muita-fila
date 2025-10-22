import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  }, [onFileUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  }, [onFileUpload]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Carregar Escala de Pausas</h2>
        <p className="text-text-secondary">Por favor, carregue a escala diária em formato CSV para iniciar o monitoramento.</p>
      </div>

      <div 
        className={`border-2 ${dragActive ? 'border-brand-lime' : 'border-dashed border-slate-300'} p-10 rounded-lg text-center transition-colors duration-200`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" id="file-upload" className="hidden" accept=".csv" onChange={handleChange} />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="text-slate-700 font-semibold">
              {dragActive ? "Solte o arquivo aqui" : "Arraste e solte seu arquivo aqui"}
            </p>
            <p className="text-slate-500 text-sm mt-1">ou</p>
            <span className="mt-2 bg-brand-lime hover:brightness-95 text-brand-navy font-bold py-2 px-4 rounded-lg transition-colors">
              Procurar Arquivo
            </span>
          </div>
        </label>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-brand-navy mb-3">Instruções e Formato do Arquivo</h3>
        <p className="text-text-secondary mb-4">
          O arquivo deve ser um CSV com vírgula (,) como delimitador. O sistema irá extrair automaticamente as colunas necessárias: 
          <code className="bg-slate-200 text-sm font-mono p-1 rounded">NOME</code>, 
          <code className="bg-slate-200 text-sm font-mono p-1 rounded">1º DESCANSO</code>, 
          <code className="bg-slate-200 text-sm font-mono p-1 rounded">ALIMENTAÇÃO INI</code>, e 
          <code className="bg-slate-200 text-sm font-mono p-1 rounded">2º DESCANSO</code>.
          As outras colunas no arquivo serão ignoradas. Todos os horários devem estar no formato <code className="bg-slate-200 text-sm font-mono p-1 rounded">HH:MM</code>.
        </p>
        <h4 className="font-semibold text-slate-700 mb-2">Exemplo de Conteúdo CSV:</h4>
        <pre className="bg-slate-100 p-4 rounded-md text-sm text-slate-800 overflow-x-auto">
          <code>
            NOME,ENTRADA,SAÍDA,NR17,1º DESCANSO,ALIMENTAÇÃO INI,FIM,2º DESCANSO,SUPERVISOR<br/>
            Ana Silva,09:00,17:00,Sim,11:10,12:20,13:20,15:10,Líder A<br/>
            João Costa,09:00,17:00,Sim,11:20,13:00,14:00,15:20,Líder A<br/>
            Maria Oliveira,09:00,17:00,Sim,11:30,13:40,14:40,15:30,Líder B<br/>
          </code>
        </pre>
      </div>
    </div>
  );
};

export default FileUpload;