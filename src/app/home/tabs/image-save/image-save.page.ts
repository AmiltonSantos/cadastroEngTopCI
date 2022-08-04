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
            const rowsItens = [];
            rowsItens.push([{ text: 'Imagem', bold: true, style: 'tableHeader', fontSize: 6, border: [false, false, false, false] }]);

            const rowsDados = [];
            rowsDados.push([{ text: 'N° Cadastro', bold: true, style: 'tableHeader', fontSize: 6, border: [false, false, false, false] }]);

            const rowsImage = [];
            if (this.imagem1.length > 0) {
                for (const item of this.imagem1) {
                    rowsImage.push([
                        {
                            image: 'data:image/jpeg;base64,' + item[0],
                            width: 150,
                            height: 150,
                        },
                        {
                            image: 'data:image/jpeg;base64,' + item[1],
                            width: 150,
                            height: 150,
                        },
                        {
                            image: 'data:image/jpeg;base64,' + item[2],
                            width: 150,
                            height: 150,
                        },
                        {
                            image: 'data:image/jpeg;base64,' + item[3],
                            width: 150,
                            height: 150,
                        }
                    ]);
                }
            }

            // Montando pdf com os dados acima
            const docDefinition = {
                pageOrientation: 'portrait', // Modo paisagem
                content: [
                    /*Cabeçalho do PDF com os dados da empresa e do usuário*/
                    { text: new Date().toTimeString(), alignment: 'right' },

                    { text: 'Informações Cadastro:', style: 'subheader', color: '#2474a5' },
                    {
                        style: 'tableExample',
                        table: {
                            heights: ['30', '*'],
                            body: [
                                ['Empresa:', { text: '' + 'Amilton Santos Tecnologia' + '', bold: true, }],
                            ]
                        },
                        layout: 'noBorders'
                    },

                    {
                        table: {
                            widths: ['*'],
                            body: [
                                // eslint-disable-next-line max-len
                                [{ text: 'Informações do Proprietário  ', alignment: 'center', fontSize: 8, bold: true, border: [false, false, false, false] }],
                            ]
                        },
                        layout: {
                            // tslint:disable-next-line: object-literal-shorthand
                            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                            fillColor(rowIndex) {
                                // node, columnIndex -
                                return (rowIndex % 1 === 0) ? '#95b4db' : null;
                            }
                        }
                    },

                    // Dados do Pedido
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*'],
                            headerRows: 1,
                            body: rowsDados
                        },
                        layout: {
                            // tslint:disable-next-line: object-literal-shorthand
                            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                            fillColor(rowIndex) {
                                // node, columnIndex -
                                return (rowIndex % 2 === 0) ? '#d5dfe5' : null;
                            }
                        }
                    },

                    // Itens do pedido
                    {
                        table: {
                            widths: ['*'],
                            body: [
                                // eslint-disable-next-line max-len
                                [{ text: 'Informações do Imóvel ', alignment: 'center', bold: true, fontSize: 8, border: [false, false, false, false] }],
                            ]
                        },
                        layout: {
                            // tslint:disable-next-line: object-literal-shorthand
                            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                            fillColor(rowIndex) {
                                // node, columnIndex -
                                return (rowIndex % 1 === 0) ? '#95b4db' : null;
                            }
                        }
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['*'],
                            headerRows: 1,
                            body: rowsItens

                        },

                        layout: {
                            // tslint:disable-next-line: object-literal-shorthand
                            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                            fillColor(rowIndex) {
                                // node, columnIndex -
                                return (rowIndex % 2 === 0) ? '#d5dfe5' : null;
                            }
                        }
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: ['auto', 'auto', 'auto', 'auto'],
                            body: rowsImage
                        },
                    },
                    // { text: 'OBS: Quando o numero do pedido conter "/ temporário" o pedido ainda não foi enviado!', fontSize: 6 },
                ],
                // Rodapé
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                footer(currentPage: any, pageCount: any) {
                    return {
                        columns: [
                            // eslint-disable-next-line max-len
                            { text: 'Todos os direitos reservados - Amilton Santos Tecnologia - Copyright' + ' | Pagina ' + currentPage.toString() + ' de ' + pageCount, alignment: 'center', fontSize: 6 }
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
