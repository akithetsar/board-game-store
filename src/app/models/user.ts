import { Cart } from "./Cart";
import { Order } from "./Order";

export class User {
    username = '';
    name = '';
    surname = '';
    password = '';
    orders:Order[]=[];
    cart:Cart|null=null;
}