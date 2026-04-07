import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { GifsSideMenuHeader } from "../../components/side-menu-header/gifs-side-menu-header";
import { GifsSideMenuOptions } from "../../components/side-menu-options/gifs-side-menu-options";
import { SideMenu } from "../../components/side-menu/side-menu";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, SideMenu],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPage { }
