import { NgModule } from '@angular/core';
import {Routes, RouterModule, Router, NavigationEnd} from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import {IndexComponent} from "./index/index.component";
import {WebsocketService} from "./chat/shared/services/websocket.service";

const routes: Routes = [
  {
    path: '', component: IndexComponent
  },
  {
    path: 'chat/:user_id', component: ChatComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private wsService: WebsocketService, private route:Router) {
    this.wsService.connect();
    this.routeEvent(route);
  }

  routeEvent(router: Router){
    router.events.subscribe(e => {
      if(e instanceof NavigationEnd){
        this.wsService.send('whoami', {});
      }
    });
  }
}
