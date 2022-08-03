import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    constructor(private platform: Platform,
        private backgroundMode: BackgroundMode,
        private statusBar: StatusBar) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready().then(async () => {

            if (this.platform.is('cordova')) {

                this.backgroundMode.enable();
                this.backgroundMode.setDefaults({ silent: true });

                // this.statusBar.styleDefault();
                // let status bar overlay webview
                this.statusBar.overlaysWebView(false);

                // set status bar to white
                this.statusBar.backgroundColorByHexString('#244381');
                //this.splashScreen.hide();

            }

        });

    }
}
