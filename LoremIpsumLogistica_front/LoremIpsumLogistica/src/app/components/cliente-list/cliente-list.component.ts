import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ClienteModel } from '../../models/cliente.model';

import { HttpClientService } from '../../service/http-client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'dataNascimento', 'sexo', 'opcoes'];
  dataSource = new MatTableDataSource<ClienteModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private link: string = 'Cliente';

  constructor(private clienteService: HttpClientService, private router: Router) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.get(this.link).subscribe((clientes: ClienteModel[]) => {
      this.dataSource.data = clientes;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  excluirCliente(id: number) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.delete(id, this.link).subscribe(() => {
        alert('Cliente excluído com sucesso!');
        this.loadClientes();
      });
    }
  }

  editarCliente(id: number) {
    this.router.navigate(['/clientes/edit', id]);
  }
}
