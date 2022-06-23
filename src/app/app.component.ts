import { Component, HostListener } from '@angular/core';
import { CoreService } from './services/core.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Amigos';

    constructor(
        public coreService: CoreService,
    ) {

    }

    @HostListener('window:load')
    onLoad() {
        this.coreService.database.startDatabase()
    }
}
