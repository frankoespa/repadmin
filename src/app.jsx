import React from "react";
import { Link, Route } from "react-router-dom";
import Admin from './components/Admin'
import Agregar from "./components/Agregar";
import Modificar from './components/Modificar';
import tippy from 'tippy.js';

export default class App extends React.Component {

    componentDidMount(){
        tippy(this.home,{
            arrow: true,
            placement: 'right',
            arrowType: 'sharp',
            duration: 100,
            animation: 'scale',
            distance: '25'
          });
          tippy(this.add,{
            arrow: true,
            placement: 'right',
            arrowType: 'sharp',
            duration: 100,
            animation: 'scale',
            distance: '25'
          })
    }

    render() {
        return (
            <div id="app" className="columns">
                <div id="sideMenu" className="column is-narrow">
                    <Link to="/">
                        <img ref={home=>this.home=home} title="Listado de vehículos" className="btnside" src={"./asset/home.svg"} />
                    </Link>
                    <Link to="/agregar">
                        <img ref={add=>this.add=add} title="Agregar un vehículo" className="btnside" src={"./asset/add.svg"} />
                    </Link>
                </div>
                <div id="main" className="column section">
                    <Route exact path="/"component={Admin} />
                    <Route path="/agregar" component={Agregar} />
                    <Route path="/admin/:id" component={Modificar}/>
                </div>
            </div>
        );
    }
}
