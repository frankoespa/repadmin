import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
const Datastore = require('nedb');

class Admin extends Component {

    constructor(props) {
        super(props);
        this.db = new Datastore({ filename: 'src/data/data.db', autoload: true });
        this.state = {
            all: [],
            carga: 'Cargando...'
        };
        this.change = this.change.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        console.log(this.props.match.url)
    }

    componentDidMount() {
        let este = this;
        this.db.find({}).sort({ fact: -1 }).exec(function (err, docs) {
            este.setState({
                all: docs,
                carga: docs.length == 0 ? 'No hay vehículos' : 'Cargando...'
            }, () => {
                este.pat.focus()
            })
        })
    }

    change() {
        let este = this;
        if (this.pat.value.length > 0 && this.pat.value[this.pat.value.length - 1] === ' ') {

            this.pat.value = this.pat.value.trim();
            return

        };
        if (this.pat.value.length == 0) {
            this.db.find({}).sort({ fact: -1 }).exec(function (err, docs) {
                este.setState({
                    all: docs
                })
            });
            return
        }
        let exp = new RegExp(this.pat.value.toUpperCase());
        this.db.find({ _id: exp }).sort({ fact: -1 }).exec(function (err, docs) {
            este.setState({
                all: docs,
                carga: docs.length == 0 ? 'No hay vehículos' : 'Cargando'
            })
        })
    }

    deleteItem(id) {
        let este = this;
        swal({
            title: "¿Quieres borrarlo definitivamente?",
            text: "Una vez borrado, el vehículo dejará de existir",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    este.db.remove({ _id: id }, {}, function (err, numremove) {
                        console.log('se eliminó ' + numremove + " elemento");
                        este.db.find({}).sort({ fcarga: -1 }).exec(function (err, docs) {
                            este.setState({
                                all: docs,
                                carga: docs.length == 0 ? 'No hay vehículos' : 'Cargando'
                            }, () => {
                                swal(`¡Vehículo ${id} eliminado!`, {
                                    icon: "success",
                                })
                            })
                        })

                    })
                } else {
                    swal(`El vehículo ${id} está a salvo, no se ha borrado`)
                }
            });

    }

    render() {
        let all;
        if (this.state.all.length > 0) {
            all = this.state.all.map((item, i) => (
                <div key={i} className="columns box sin-pad marbot" style={{ alignItems: "center", backgroundColor: "#0c121d" }}>
                    <div className="column is-1 has-text-right">
                        <img onClick={() => { this.deleteItem(item._id) }} className="btnitem" src={"./asset/delete.svg"} />
                    </div>
                    <div className="column is-1 has-text-left">
                        <Link to={`/admin/${item._id}`}>
                            <img className="btnitem" src={"./asset/ver.svg"} />
                        </Link>
                    </div>
                    <div className="column has-text-centered">
                        <h6 className="title is-6 has-text-weight-normal has-text-white">
                            {item._id}
                        </h6>
                    </div>
                    <div className="column has-text-centered">
                        <h6 className="title is-6 has-text-weight-normal has-text-white">
                            {item.fcarga}
                        </h6>
                    </div>
                    <div className="column has-text-centered">
                        <h6 className="title is-6 has-text-weight-normal has-text-white">
                            {item.fact}
                        </h6>
                    </div>
                    <div className="column has-text-centered">
                        <h6 className="title is-6 has-text-weight-normal has-text-white">
                            {item.reps.length}
                        </h6>
                    </div>
                </div>
            ))
        }
        return (
            <div className="container">
                <div className="columns is-centered marcab">
                    <div className="column is-3">
                        <div className="field">
                            <div className="control">
                                <input onChange={this.change} className="input is-medium is-uppercase has-text-white has-text-centered is-rounded" type="text" placeholder="Buscar Patente" maxLength="7" style={{ backgroundColor: '#0c121d', borderColor: '#6320ee' }} ref={(pat) => { this.pat = pat }} />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.all.length > 0 &&
                    <div className="columns box sin-pad marbot" style={{ alignItems: "center", backgroundColor: '#6320ee' }}>
                        <div className="column is-2 has-text-centered" style={{ backgroundColor: '#0c121d' }}>
                            <h6 className="title is-6 has-text-white">TOTAL: {this.state.all.length}</h6>
                        </div>
                        <div className="column has-text-centered">
                            <h6 className="title is-6 has-text-white">PATENTE</h6>
                        </div>
                        <div className="column has-text-centered">
                            <h6 className="title is-6 has-text-white">FECHA DE ALTA</h6>
                        </div>
                        <div className="column has-text-centered">
                            <h6 className="title is-6 has-text-white">ÚLTIMOS CAMBIOS</h6>
                        </div>
                        <div className="column has-text-centered">
                            <h6 className="title is-6 has-text-white">N° REPs</h6>
                        </div>
                    </div>
                }
                {all}
                {this.state.all.length == 0 &&
                    <div className="columns is-centered sin-pad mar-top" style={{ alignItems: "center" }}>
                        <div className="column is-4 has-text-centered box" style={{ backgroundColor: '#0c121d' }}>
                            <h6 className="title is-6 has-text-white">
                                {this.state.carga}
                            </h6>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Admin;