import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-image-save',
    templateUrl: './image-save.page.html',
    styleUrls: ['./image-save.page.scss'],
})
export class ImageSavePage {

    pdfObj = null;
    imgCapt = '';
    filePath: any;
    imagem1 = [];
    imagemEscolhida: any;

    constructor(private camera: Camera,
        private file: File,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private cd: ChangeDetectorRef,
        private fileOpener: FileOpener,
        private socialSharing: SocialSharing,
        private backgroundMode: BackgroundMode,
        private platform: Platform) { }

    async carregandoAsImgs(imagemEsco: string) {
        if (imagemEsco === 'imagemEsco1') {
            this.imagem1.push(this.imgCapt);
            this.imagemEscolhida = await this.b64toBlob(this.imagem1[0], 'image/png');
        }
    }

    async b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        const sliceSize = 512;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    async touchCapturandoImgs(imagemEsco: string) {
        if (this.imagem1.length <= 3) {
            const alert = await this.alertController.create({
                message: '<img src="assets/imgs/pushNotification.png" alt="auto"><br><br> <b>De onde quer pegar a imagem?</b>',
                backdropDismiss: false,
                cssClass: 'alertaCssTres',
                buttons: [
                    {
                        text: 'Voltar',
                        cssClass: 'okButton',
                        handler: () => {

                        }
                    }, {
                        text: 'GALERIA',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: async () => {
                            await this.getImgCamera(0).then(async () => {
                                if (this.imgCapt !== '') {
                                    this.carregandoAsImgs(imagemEsco);
                                }
                            });
                        }
                    }, {
                        text: 'CAMERA',
                        handler: async () => {

                            await this.getImgCamera(1).then(async () => {
                                if (this.imgCapt !== '') {
                                    this.carregandoAsImgs(imagemEsco);
                                }
                            });
                        }
                    }
                ]
            });
            await alert.present();
        } else {
            await this.alertaComOk('atencao', '<b>Ops! Número máximo de imagem é 4</b>');
        }

    }

    async getImgCamera(sourceType: number) {
        this.imgCapt = '';
        try {

            const options: CameraOptions = {
                quality: 20,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType
            };

            await this.camera.getPicture(options).then((imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                // const base64Image = 'data:image/jpeg;base64,' + imageData;
                // console.log(base64Image)
                this.imgCapt = imageData;

            }, (err) => {
                console.log('Erro ao abrir a camera!', err);
            });
        } catch (error) {
            console.log('Erro ao abrir a camera!', error);
        }

    }

    async touchRemoverImgEscolhida(tipoDocumento: string, arryImagemEscolhida: any, img: any) {

        const alert = await this.alertController.create({
            message: `<ion-img src="data:image/jpeg;base64,${img}" alt="loading..."></ion-img> <br><br> Deseja apagar essa imagem?`,
            backdropDismiss: false,
            cssClass: 'alertaCss',
            buttons: [
                {
                    text: 'Não',
                    cssClass: 'cancelarButton',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Sim',
                    cssClass: 'okButton',
                    handler: async () => {

                        const loading = await this.loadingController.create({
                            // eslint-disable-next-line max-len
                            message: '<ion-img src="/assets/gif/loading.gif" alt="loading..."></ion-img> <br><br> Apagando imagem escolhida!',
                            duration: 100000,
                            spinner: null,
                            cssClass: 'loadingCss',
                        });
                        await loading.present();

                        for (let i = 0; i < arryImagemEscolhida.length; i++) {

                            if (arryImagemEscolhida[i] === img) {
                                console.log('E a mesma imagem');

                                arryImagemEscolhida.splice(i, 1);

                                if (tipoDocumento === 'imagemEsco') {
                                    this.imagem1 = arryImagemEscolhida;
                                }
                            }

                        }

                        this.cd.detectChanges();
                        await loading.dismiss();
                    }
                }
            ]
        });
        await alert.present();
    }

    // Gerando o PDF
    async criarPdfPedido() {
        this.backgroundMode.enable();
        console.log('Entrou no criar PDF');

        const loading = await this.loadingController.create({
            message: '<ion-img src="/assets/gif/pdfCreate.gif" alt="loading..."></ion-img><br><br>  <b>Gerando PDF do Cadastro!</b>',
            cssClass: 'loadingCss',
            duration: 100000,
            spinner: null,
        });
        await loading.present();

        try {
            const rowsImage = [];
            if (this.imagem1.length > 0) {
                for (const item of this.imagem1) {
                    rowsImage.push([
                        {
                            image: 'data:image/jpeg;base64,' + item,
                            width: 120,
                        }
                    ]);
                }
            }

            const rowsSemImagem = [];
            if (this.imagem1.length === 0) {
                rowsSemImagem.push([
                    {
                        italics: true,
                        fontSize: 15,
                        color: '#FF0000',
                        text: 'NENHUMA IMAGEM ADICIONADA!'
                    }
                ]);
            }

            // Montando pdf com os dados acima
            const docDefinition = {
                pageOrientation: 'portrait', // Modo paisagem
                content: [
                    /*Cabeçalho do PDF com os dados da empresa e do usuário*/
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 6,
                                text: 'Governo do Amazonas'
                            },
                            {
                                fontSize: 7,
                                text: 'DADOS DO CADASTRO DO IMOVEL'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Prefeitura Municipal de Iranduba'
                            },
                            {
                                fontSize: 7,
                                text: 'Exercício Ano: 2022 UFM R$ 90,91'
                            },
                        ],
                    },
                    {
                        columns: [
                            {
                                fontSize: 7,
                                text: 'SECRETARIA MUNICIPAL DE FINANÇAS'
                            },
                        ],
                    },

                    // eslint-disable-next-line max-len
                    '----------------------------------------------------------------------------------------------------------------------------------------------------------',
                    { text: 'Inscrição: 22100001', fontSize: 7 },
                    { text: 'Endereço do Imóvel: , Bairro:', fontSize: 7 },
                    { text: 'Complemento: - CEP:', fontSize: 7 },
                    { text: 'Nome Proprietário: CPF/CNPJ:', fontSize: 7 },
                    {
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Nome Proprietário:'
                            },
                            {
                                fontSize: 7,
                                text: 'CPF/CNPJ:'
                            },
                        ],
                    },
                    { text: 'Endereço: , Bairro:', fontSize: 7 },
                    { text: 'Complemento: - CEP:', fontSize: 7 },

                    '\n',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'IMÓVEL'
                            },
                            {
                                fontSize: 7,
                                text: 'TERRENO'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: '------------------------------------------------------------------'
                            },
                            {
                                text: '------------------------------------------------------------------'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Ocupação:'
                            },
                            {
                                fontSize: 7,
                                text: 'Situação:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Patrimônio:'
                            },
                            {
                                fontSize: 7,
                                text: 'Topografia:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'USO:'
                            },
                            {
                                fontSize: 7,
                                text: 'Pedologia:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Isento IPTU:'
                            },
                            {
                                fontSize: 7,
                                text: 'Limitação/Muro:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Aquisição:'
                            },
                            {
                                fontSize: 7,
                                text: 'Calçada:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: ''
                            },
                            {
                                fontSize: 7,
                                text: 'AT - Área do terreno:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: ''
                            },
                            {
                                fontSize: 7,
                                text: 'AUC - Área da unidade construida:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                text: ''
                            },
                            {
                                fontSize: 7,
                                text: 'CalATE - Área total construida(Edificada)çada:'
                            },
                        ],
                    },

                    'EDIFICAÇÃO',
                    // eslint-disable-next-line max-len
                    '----------------------------------------------------------------------------------------------------------------------------------------------------------',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'TIPO:'
                            },
                            {
                                fontSize: 7,
                                text: 'Padrão const:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Alinhamento:'
                            },
                            {
                                fontSize: 7,
                                text: 'Conservação:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Situação do lote:'
                            },
                            {
                                fontSize: 7,
                                text: 'Inst sanitária:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Situação unid:'
                            },
                            {
                                fontSize: 7,
                                text: 'Inst elétrica:'
                            },
                        ],
                    },
                    { text: 'Estrutura', fontSize: 7 },

                    '\n',
                    'INFRA ESTRUTURA - Fc 12',
                    // eslint-disable-next-line max-len
                    '----------------------------------------------------------------------------------------------------------------------------------------------------------',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Água:'
                            },
                            {
                                fontSize: 7,
                                text: 'Sarjeta:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Esgoto:'
                            },
                            {
                                fontSize: 7,
                                text: 'Energia:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Limpeza:'
                            },
                            {
                                fontSize: 7,
                                text: 'Iluminação:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Pavimentação:'
                            },
                            {
                                fontSize: 7,
                                text: 'Telefone:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Galeria:'
                            },
                            {
                                fontSize: 7,
                                text: 'Lixo:'
                            },
                        ],
                    },

                    '\n',
                    'FOTOS DO IMÓVEL',
                    // eslint-disable-next-line max-len
                    '----------------------------------------------------------------------------------------------------------------------------------------------------------',
                    /*Adiciona Imagem*/
                    {
                        alignment: 'justify',
                        columns: rowsImage
                    },
                    {
                        alignment: 'center',
                        columns: rowsSemImagem
                    },

                    '\n',
                    'Calculo do IPTU',
                    // eslint-disable-next-line max-len
                    '----------------------------------------------------------------------------------------------------------------------------------------------------------',
                    { text: 'Valor da UFM em R$ 90,91', fontSize: 7 },
                    { text: 'Alíquota do IPTU (%) 1 Normal', fontSize: 7 },

                    '\n',
                    'FÓRMULAS',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'FIT=(AUC/ATE) x AT VT=FIT x (Valor doM²) x Fc1x Fc2x Fc3x Fc4x Fc5'
                            },
                            {
                                fontSize: 7,
                                text: 'UFM R$:'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'VT=AT x (Valor doM²plantadeValores) x Fc1x Fc2x Fc3x Fc4x Fc5'
                            },
                            {
                                fontSize: 7,
                                text: '#valor1 #valor3'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'VE=AUC x (Valor doM²TipodeConstrução) x Fc6x Fc7x Fc8x Fc9x Fc10x Fc11x Fc12:'
                            },
                            {
                                fontSize: 7,
                                text: '#valor2 #valor4'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'Coletade Lixo=AUC x UFMpor M² x UFM:'
                            },
                            {
                                fontSize: 7,
                                text: '#soma1  #soma2'
                            },
                        ],
                    },

                    '\n',
                    'LEGENDAS',
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'VV = Valor Venal'
                            },
                            {
                                alignment: 'right',
                                text: '------------------------------------------------------------------'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'VT = Valor do Terreno'
                            },
                            {
                                fontSize: 7,
                                alignment: 'right',
                                text: 'IPTU  #valIPTU'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'VE = Valor da Edificação'
                            },
                            {
                                fontSize: 7,
                                alignment: 'right',
                                text: 'Coleta de lixo   #valColetaLixo'
                            },
                        ],
                    },
                    {
                        alignment: 'justify',
                        columns: [
                            {
                                fontSize: 7,
                                text: 'FIT = Fração Ideal do Terreno'
                            },
                            {
                                fontSize: 7,
                                alignment: 'right',
                                text: 'Valor do Carnet   #valCarnet'
                            },
                        ],
                    },
                    { text: 'AT = Área do Terreno', fontSize: 7 },
                    { text: 'AUC = Área da Unidade Cosntruída', fontSize: 7 },
                    { text: 'ATE = Área Total Construída(Edificada)', fontSize: 7 },
                ],

                // Rodapé
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                footer(currentPage: any, pageCount: any) {
                    return {
                        columns: [
                            // eslint-disable-next-line max-len
                            { text: 'Data do Cadastro: ' + new Date().toLocaleDateString('pt-br') + '- Todos os direitos reservados - Amilton Santos Tecnologia - Copyright' + ' | Pagina ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', fontSize: 6 }
                        ]
                    };
                },
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        margin: [0, 15, 0, 0]
                    },
                    story: {
                        italic: true,
                        alignment: 'center',
                        width: '50%',
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                }
            };

            try {
                this.pdfObj = pdfMake.createPdf(docDefinition);
                await this.pdfObj.getBuffer(async (buffer) => {
                    const blob = new Blob([buffer], { type: 'application/pdf' });

                    // Save the PDF to the data Directory of our App
                    if (this.platform.is('cordova')) {
                        if (this.platform.is('android')) {
                            await this.file.writeFile(this.file.externalDataDirectory, 'cadastroPdf.pdf', blob, { replace: true });
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        //await this.connectorExternoProvider.arquivoGeral('relatorios', 'cadastroPdf.pdf', buffer, 'binary', this.cargaInicialUtil.dadosGerais.vendedorEscolhido.vendedorId + '_' + this.cargaInicialUtil.dadosGerais.contaId);
                    }
                });

                await loading.dismiss();
                this.presentAlertConfirm('cadastroPdf');

            } catch (error) {
                console.log('🚀 ~ file: pdfFile.util.ts ~ line 437 ~ PdfFileUtil ~ error', error);
                await loading.dismiss();

            }
        } catch (error) {
            await loading.dismiss();
            console.log('🚀 ~ file: pdfFile.util.ts ~ line 206 ~ PdfFileUtil ~ criarPdfNotificacao ~ error', error);
            await this.alertaComOk('atencao', '<b>Ops! Erro encontrado ao montar o PDF!</b> <br><br> Erro:' + error.message);
        }
    }

    async presentAlertConfirm(erroOrPedido: string) {

        if (this.platform.is('cordova')) {
            const alert = await this.alertController.create({
                // eslint-disable-next-line max-len
                message: '<img src="assets/imgs/check.png" alt="auto"><br><br> <text>PDF Gerado com sucesso!</text>  <br><br> <b>O que você deseja fazer?</b>',
                cssClass: 'alertaCssTres',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Voltar',
                        handler: () => {
                            // Voltando
                        }
                    },
                    {
                        text: 'Download',
                        cssClass: 'salvarEnviarButton',
                        handler: () => {
                            this.downloadPdf(erroOrPedido);
                        }
                    },
                    {
                        text: 'Whatsapp',
                        handler: async () => {
                            await this.compartilhandoConteudo(erroOrPedido);
                        }
                    }
                ]
            });
            await alert.present();
        } else {
            const alert = await this.alertController.create({
                // eslint-disable-next-line max-len
                message: '<img src="assets/imgs/check.png" alt="auto"><br><br> <text>PDF Gerado com sucesso!</text> <br><br> <b>O que você deseja fazer?</b>',
                cssClass: 'alertaCss',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Voltar',
                        handler: () => {
                            // Voltando
                        }
                    },
                    {
                        text: 'Download',
                        cssClass: 'salvarEnviarButton',
                        handler: () => {
                            this.downloadPdf(erroOrPedido);
                        }
                    }
                ]
            });
            await alert.present();
        }
    }

    async downloadPdf(erroOrPedido: string) {
        if (this.platform.is('cordova')) {
            if (this.platform.is('android')) {
                this.fileOpener.open(this.file.externalDataDirectory + '' + erroOrPedido + '.pdf', 'application/pdf');
            }
        } else {
            // eslint-disable-next-line max-len
            //let result = await this.connectorExternoProvider.getUrlArquivoGeral(`relatorios/${erroOrPedido}.pdf`, this.cargaInicialUtil.dadosGerais.vendedorEscolhido.vendedorId + '_' + this.cargaInicialUtil.dadosGerais.contaId);
            //window.open(result);
        }
    }

    async alertaComOk(icon: any, msg: any, comRota?: string): Promise<any> {
        const promise = new Promise(async (resolve) => {

            const alert = await this.alertController.create({
                // header: 'Ops!',
                message: ' <img src="assets/imgs/' + icon + '.png" alt="auto"> <br><br> ' + msg,
                cssClass: 'alertaCss',
                backdropDismiss: false,
                // message: 'This is an alert message.',
                buttons: [
                    {
                        text: 'Ok',
                        cssClass: 'cancelButton',
                        role: 'cancel',
                        handler: () => {
                            resolve('Ok');
                        }
                    }
                ]
            });

            await alert.present();

            // Se existir rota ira redirecionar
            // if (comRota) {
            //     alert.onDidDismiss().then(() => {
            //         this.router.navigateByUrl(`${comRota}`);
            //     });
            // }
        });

        return promise.then(() => {
            // console.log('Retorno da promise API tabelas: ', res);
        });
    }

    async compartilhandoConteudo(erroOrPedido) {

        try {
            if (this.platform.is('android')) {
                await this.socialSharing.shareViaWhatsApp('', `${this.file.externalDataDirectory + erroOrPedido}.pdf`);
            } else if (this.platform.is('ios')) {
                await this.socialSharing.shareViaWhatsApp('', `${this.file.dataDirectory + erroOrPedido}.pdf`);
            }
        } catch (error) {
            console.log('🚀 ~ file: externo.util.ts ~ line 148 ~ ExternoUtil ~ error', error);
            await this.alertaComOk('atencao', 'Ops! Não conseguimos compartilhar com o Whatsapp! <br><br> Erro:' + error.message);
        }

    }

}
