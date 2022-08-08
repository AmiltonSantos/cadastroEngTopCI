import { Proprietario } from './../../models/Proprietario';
import { Component, OnInit } from '@angular/core';
import { FormGroup  } from '@angular/forms';

@Component({
    selector: 'app-dados-proprietario',
    templateUrl: './dados-proprietario.page.html',
    styleUrls: ['./dados-proprietario.page.scss'],
})
export class DadosProprietarioPage implements OnInit {
    formCadastro: FormGroup;
    proprietario: Proprietario = new Proprietario();

    constructor() { }

    ngOnInit() {
    }

    async salvarCadastro() {
        if (this.formCadastro.valid) {
            this.proprietario.proprietario = this.formCadastro.value.proprietario;
            this.proprietario.cpf = this.formCadastro.value.cpf;
            this.proprietario.rg = this.formCadastro.value.rg;
            this.proprietario.tipo1 = this.formCadastro.value.tipo1;
            this.proprietario.logradouro1 = this.formCadastro.value.logradouro1;
            this.proprietario.numero1 = this.formCadastro.value.numero1;
            this.proprietario.bairro1 = this.formCadastro.value.bairro1;
            this.proprietario.cep1 = this.formCadastro.value.cep1;
            this.proprietario.complemento1 = this.formCadastro.value.complemento1;

            this.proprietario.setor1 = this.formCadastro.value.setor1;
            this.proprietario.inscricao = this.formCadastro.value.inscricao;
            this.proprietario.tipo2 = this.formCadastro.value.tipo2;
            this.proprietario.logradouro2 = this.formCadastro.value.logradouro2;
            this.proprietario.numero2 = this.formCadastro.value.numero2;
            this.proprietario.cep2 = this.formCadastro.value.cep2;
            this.proprietario.bairro2 = this.formCadastro.value.bairro2;
            this.proprietario.complemento2 = this.formCadastro.value.complemento2;

            this.proprietario.frente = this.formCadastro.value.frente;
            this.proprietario.fundo = this.formCadastro.value.fundo;
            this.proprietario.ladodireito = this.formCadastro.value.ladodireito;
            this.proprietario.ladoesquerdo = this.formCadastro.value.ladoesquerdo;
            this.proprietario.areaunidconstr = this.formCadastro.value.areaunidconstr;
            this.proprietario.areatotcostedif = this.formCadastro.value.areatotcostedif;
            //await this.storageService.set(this.usuario.email, this.usuario);
            //this.route.navigateByUrl('/home')
        } else {
            alert('Formulário Inválido');
        }
    }

}
