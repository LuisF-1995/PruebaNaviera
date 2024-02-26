import { AdminPage } from "../app/pages/admin/admin.component";
import { RootPage } from "../app/pages/root/root.component";
import { TicketBoothPage } from "../app/pages/ticket-booth/ticket-booth.component";
import { UserPage } from "../app/pages/user/user.component";

export const root = {
  path: "",
  title: "Naviera Home",
  component: RootPage
};

export const admin = {
  path: "admin",
  title: "Naviera Admin",
  component: AdminPage
};

export const ticketBooth = {
  path: "ticket-booth",
  title: "Ticket Booth",
  component: TicketBoothPage
};

export const user = {
  path: "users",
  title: "Naviera Users",
  component: UserPage
};
