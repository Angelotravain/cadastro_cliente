import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteModel } from 'src/app/models/cliente.model';
import { HttpClientService } from 'src/app/service/http-client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EnderecoModel } from 'src/app/models/endereco.model';
import { ViaCepService } from 'src/app/service/via-cep.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {
  private link: string = 'Cliente';
  private linkEndereco: string = 'Endereco';
  displayedColumns: string[] = ['logradouro', 'cep', 'bairro', 'opcoes'];
  clienteForm: FormGroup;
  enderecoForm: FormGroup;
  dataSource = new MatTableDataSource<EnderecoModel>();
  enderecos: EnderecoModel[] = [];
  enderecoSave: EnderecoModel[] = [];
  enderecoEdit: EnderecoModel[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private clienteService: HttpClientService,
    private fb: FormBuilder,
    private router: Router,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar
  ) {
    this.clienteForm = this.fb.group({
      id: [{ value: '0', disabled: true }],
      nome: [''],
      dataNascimento: [''],
      sexo: ['']
    });

    this.enderecoForm = this.fb.group({
      id: [{ value: '0', disabled: true }],
      cep: [''],
      logradouro: [''],
      numero: [''],
      bairro: [''],
      complemento: [''],
      cidade: [''],
      uf: [''],
      clienteId: [''],
      tipoEndereco: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const clienteId = +params['id'];
      this.loadClienteSelecionado(clienteId);
      this.preencherCampoClienteId(clienteId);
      this.loadEnderecos(clienteId);
    });
  }


  loadClienteSelecionado(id: number) {
    this.clienteService.getById(id, this.link).subscribe((cliente: ClienteModel) => {
      this.clienteForm.patchValue({
        id: +cliente.id,
        nome: cliente.nome,
        dataNascimento: cliente.dataNascimento,
        sexo: cliente.sexo.toString(),
      });
    });
  }

  preencherCampoClienteId(id: number) {
    this.enderecoForm.patchValue({
      clienteId: id
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const clienteData = this.clienteForm.getRawValue();
      clienteData.id = +clienteData.id;
      clienteData.sexo = +clienteData.sexo;

      if (clienteData.id === 0) {
        this.clienteService.save(clienteData, this.link).subscribe((novoClienteId: number) => {
          this.enderecos.forEach(endereco => {
            endereco.clienteId = novoClienteId;
          });
          this.salvarEndereco(this.enderecos);
        });
      } else {
        this.clienteService.updateById(clienteData.id, clienteData, this.link).subscribe(() => {
          this.enderecos.forEach(endereco => {
            endereco.clienteId = clienteData.id;
          });
          this.salvarEndereco(this.enderecos);
          this.snackBar.open('Cliente alterado com sucesso!', 'Fechar', { duration: 3000 });
        });
      }
    }
    this.retornarListaDeClientes();
  }

  salvarEndereco(enderecos: EnderecoModel[]) {
    this.enderecos.forEach(endereco => {
      endereco.id = +endereco.id;
      if (endereco.id === 0) {
        this.enderecoSave.push(endereco);
      } else {
        this.enderecoEdit.push(endereco);
      }
    });

    if (this.enderecoSave.length > 0)
      this.clienteService.save(this.enderecoSave, this.linkEndereco).subscribe(() => {
      });

    if (this.enderecoEdit.length > 0)
      this.clienteService.update(this.enderecoEdit, this.linkEndereco).subscribe(() => {
      });
  }

  loadEnderecos(id: number) {
    this.clienteService.getById(id, this.linkEndereco).subscribe((enderecos: EnderecoModel[]) => {
      this.enderecos = enderecos;
      this.dataSource.data = this.enderecos;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  retornarListaDeClientes() {
    this.router.navigate(['/']);
  }

  excluirEndereco(endereco: EnderecoModel) {
    console.log('Objeto a ser excluído:', endereco);

    endereco.id = +endereco.id;
    if (endereco.id === 0) {
      this.enderecos = [...this.enderecos.filter(end => end !== endereco)];
      this.atualizarDataSource();
      this.snackBar.open('Endereço excluído com sucesso!', 'Fechar', { duration: 3000 });
    } else {
      if (confirm('Tem certeza que deseja excluir este endereço?')) {
        this.clienteService.delete(endereco.id, this.linkEndereco).subscribe(
          () => {
            this.enderecos = this.enderecos.filter(end => end.id !== endereco.id);
            this.snackBar.open('Endereço excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadEnderecos(this.clienteForm.get('id')!.value);
          },
          (error) => {
            this.snackBar.open('Erro ao excluir o endereço. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
            console.error('Erro ao excluir o endereço:', error);
          }
        );
      }
    }
  }

  atualizarDataSource() {
    this.dataSource = new MatTableDataSource(this.enderecos);
  }

  editarEndereco(endereco: EnderecoModel) {
    this.enderecoForm.patchValue(endereco);
  }

  buscarCep() {
    const cep = this.enderecoForm.get('cep')?.value;

    if (cep && cep.length === 8) {
      this.viaCepService.buscarCep(cep).subscribe(
        (dados) => {
          if (dados.erro) {
            this.snackBar.open('CEP não encontrado!', 'Fechar', { duration: 3000 });
          } else {
            this.enderecoForm.patchValue({
              logradouro: dados.logradouro,
              bairro: dados.bairro,
              cidade: dados.localidade,
              uf: dados.uf,
              complemento: dados.complemento || ''
            });
            this.snackBar.open('CEP encontrado com sucesso!', 'Fechar', { duration: 3000 });
          }
        },
        (error) => {
          console.error('Erro ao buscar o CEP', error);
          this.snackBar.open('Erro ao buscar o CEP. Tente novamente mais tarde.', 'Fechar', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Por favor, insira um CEP válido!', 'Fechar', { duration: 3000 });
    }
  }

  enviarCadastroEndereco() {
    if (this.enderecoForm.valid) {
      const endereco = this.enderecoForm.getRawValue();
      console.log('Dados do formulário:', endereco);
      endereco.tipoEndereco = +endereco.tipoEndereco;

      if (endereco.id === 0 || endereco.id === '0') {
        this.enderecos.push(endereco);
      } else {
        const index = this.enderecos.findIndex(e => e.id === endereco.id);
        if (index !== -1) {
          this.enderecos[index] = endereco;
        }
      }

      this.enderecoForm.reset({
        id: 0,
        cep: '',
        logradouro: '',
        complemento: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: '',
        tipoEndereco: '1'
      });
      this.dataSource.data = this.enderecos;
    }
  }
}
