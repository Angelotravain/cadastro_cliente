export interface EnderecoModel {
  id: number;
  cep: string;
  logradouro?: string;
  numero: string;
  complemento: string;
  bairro?: string;
  cidade: string;
  uf: string;
  clienteId: number;
  tipoEndereco: number;
}
