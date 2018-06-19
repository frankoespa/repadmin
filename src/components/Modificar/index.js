import React, { Component } from 'react';
import swal from 'sweetalert';
const Datastore = require('nedb');

class Modificar extends Component {

    constructor(props) {
        super(props);
        this.db = new Datastore({ filename: 'src/data/data.db', autoload: true });
        console.log(this.props.match.url);
        this.state = {
            reps: [],
            fcarga: '',
            edit: false,
            n: null,
            carga: 'Cargando...'
        };
        this.allreps = [];
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.editItem = this.editItem.bind(this);
        this.formatFecha = this.formatFecha.bind(this);
        this.noUpdate = this.noUpdate.bind(this);
        this.update = this.update.bind(this)
    }

    componentDidMount() {
        let este = this;
        this.db.findOne({ _id: this.props.match.params.id }, function (err, doc) {
            este.allreps = doc.reps;
            doc.reps.sort(function (a, b) { return new Date(este.formatFecha(b.fecha)) - new Date(este.formatFecha(a.fecha)) });
            este.setState({
                reps: doc.reps,
                fcarga: doc.fcarga,
                carga: este.allreps.length == 0 ? 'Este vehículo no tiene reparaciones' : 'Cargando...'
            })
        });
        this.fecha.value = this.formatFecha(new Date().toLocaleDateString())
    }

    formatFecha(f) {
        let newFecha;
        f = f.split('/');
        for (let i = 0; i < 2; i++) {
            const element = f[i];
            if (element.length == 1) {
                f[i] = '0' + element
            }
        };
        newFecha = `${f[2]}-${f[1]}-${f[0]}`;
        return newFecha
    }

    addItem() {
        let este = this;
        this.desc.value = this.desc.value.trim();
        if (this.desc.value.length != 0 && this.fecha.value.length != 0) {
            let obj = {
                desc: this.desc.value.toUpperCase(),
                fecha: new Date(this.fecha.value.replace(/-/g, '/')).toLocaleDateString()
            };
            this.allreps.push(obj);
            this.setState({
                reps: this.allreps
            }, () => {
                this.desc.value = '';
                this.fecha.value = this.formatFecha(new Date().toLocaleDateString());
                this.db.update({ _id: this.props.match.params.id }, { $set: { reps: this.state.reps, fact: new Date().toLocaleDateString() } }, {}, function (err, numReplaced) {
                    swal(`Vehículo actualizado: ${este.props.match.params.id}`, "Bien hecho, ahora aparecerá en el LISTADO DE VEHÍCULOS pero actualizado", "success")
                })
            })
        } else {
            swal({
                text: 'Para agregar la reparación debes completar los 2 datos',
                icon: 'warning'
            })
        }
    }

    deleteItem(i) {
        let este = this;
        swal({
            title: "¿Quieres borrar esta reparación?",
            text: "Una vez borrada, la reparación dejará de existir",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.allreps.splice(i, 1);
                    this.setState({
                        reps: this.allreps,
                        carga: this.allreps == 0 ? 'Este vehículo no tiene reparaciones' : 'Cargando...'
                    }, () => {
                        this.db.update({ _id: this.props.match.params.id }, { $set: { reps: this.state.reps, fact: new Date().toLocaleDateString() } }, {}, function (err, numReplaced) {
                            swal(`Vehículo actualizado: ${este.props.match.params.id}`, "Bien hecho, ahora aparecerá en el LISTADO DE VEHÍCULOS pero actualizado", "success")
                        })
                    })
                } else {
                    swal("La reparación está a salvo, no se ha borrado")
                }
            })

    }

    editItem(i, e) {
        let oldDesc = e.target.parentElement.parentElement.childNodes[2].firstChild.innerText;
        let oldFecha = e.target.parentElement.parentElement.childNodes[3].firstChild.innerText;
        console.log(oldDesc, oldFecha);
        this.setState({
            edit: true,
            n: i
        }, () => {
            this.desc.value = oldDesc;
            this.fecha.value = this.formatFecha(oldFecha)
        })

    }

    noUpdate() {
        this.setState({
            edit: false,
            n: null
        }, () => {
            this.fecha.value = this.formatFecha(new Date().toLocaleDateString())
        })
    }

    update() {
        let este = this;
        this.desc.value = this.desc.value.trim();
        if (this.desc.value.length != 0 && this.fecha.value.length != 0) {
            let obj = {
                desc: this.desc.value.toUpperCase(),
                fecha: new Date(this.fecha.value.replace(/-/g, '/')).toLocaleDateString()
            };
            this.allreps[this.state.n] = obj;
            this.setState({
                reps: this.allreps,
                edit: false,
                n: null
            }, () => {
                this.fecha.value = this.formatFecha(new Date().toLocaleDateString());
                this.db.update({ _id: this.props.match.params.id }, { $set: { reps: this.state.reps, fact: new Date().toLocaleDateString() } }, {}, function (err, numReplaced) {
                    swal(`Vehículo actualizado: ${este.props.match.params.id}`, "Bien hecho, ahora aparecerá en el LISTADO DE VEHÍCULOS pero actualizado", "success")
                })
            })
        } else {
            swal({
                text: 'Para actualizar la reparación debes completar los 2 datos',
                icon: 'warning'
            })
        }
    }

    render() {
        let all;
        if (this.state.reps.length > 0) {
            all = this.state.reps.map((item, i) => (
                <div key={i} className={`columns box sin-pad animated fadeIn marbot ${this.state.n == i ? 'is-editing' : 'fondo-1'}`} style={{ alignItems: "center" }}>
                    <div className="column is-1 has-text-right">
                        <img onClick={() => { this.deleteItem(i) }} className={`btnitem ${this.state.edit == true && 'is-invisible'}`} src={"./asset/delete.svg"} />
                    </div>
                    <div className="column is-1 has-text-left">
                        <img onClick={(e) => { this.editItem(i, e) }} className={`btnitem ${this.state.edit == true && 'is-invisible'}`} src={"./asset/edit.svg"} />
                    </div>
                    <div className="column is-7 has-text-centered">
                        <h6 className={`title is-6 has-text-weight-normal has-text-white ${this.state.n == i && 'has-text-white'}`}>
                            {item.desc}
                        </h6>
                    </div>
                    <div className="column is-3 has-text-centered">
                        <h6 className={`title is-6 has-text-weight-normal has-text-white ${this.state.n == i && 'has-text-white'}`}>
                            {item.fecha}
                        </h6>
                    </div>
                </div>
            ))
        }
        return (
            <div style={{ backgroundColor: 'white', height: 'auto', minHeight: '100%', margin: '0' }}>
                <nav className="level section">
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading is-size-6">REPARACIONES</p>
                            <p className="title">{this.state.reps.length}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading is-size-6">PATENTE</p>
                            <p className="title">{this.props.match.params.id}</p>
                        </div>
                    </div>
                    <div className="level-item has-text-centered">
                        <div>
                            <p className="heading is-size-6">FECHA DE ALTA</p>
                            <p className="title">{this.state.fcarga}</p>
                        </div>
                    </div>
                </nav>
                <div className="container pad-top-bot">
                    {this.state.edit ?
                        <div className="columns box sin-pad caja-info marcab" style={{ alignItems: "center", backgroundColor: '#0c121d' }}>
                            <div className="column is-1 has-text-right">
                                <img className="btnitem" onClick={this.noUpdate} src={"./asset/noupdate.svg"} />
                            </div>
                            <div className="column is-1 has-text-left">
                                <img className="btnitem" onClick={this.update} src={"./asset/check.svg"} />
                            </div>
                            <form onSubmit={(e) => { this.update(); e.preventDefault() }} className="column is-7 has-text-centered">
                                <input ref={(desc) => { this.desc = desc }} className="input is-rounded has-text-weight-normal has-text-white is-uppercase sin-bordes is-editing infoco" placeholder="Escriba la reparación" style={{ height: 'auto', minHeight: '2rem' }} />
                            </form>
                            <div className="column is-3 has-text-centered">
                                <input ref={(fecha) => { this.fecha = fecha }} className="input has-text-weight-normal has-text-white sin-bordes is-editing is-rounded infoco" type="date" name="fecha" />
                            </div>
                        </div>
                        :
                        <div className="columns box sin-pad caja-info marcab" style={{ alignItems: "center", backgroundColor: '#0c121d' }}>
                            <div className="column is-1 is-offset-1 has-text-left">
                                <img className="btnitem" onClick={this.addItem} src={"./asset/check.svg"} />
                            </div>
                            <form onSubmit={(e) => { this.addItem(); e.preventDefault() }} className="column is-7 has-text-centered">
                                <input ref={(desc) => { this.desc = desc }} className="input is-rounded has-text-weight-normal has-text-white is-uppercase sin-bordes infoco" placeholder="Ingrese una nueva reparación" />
                            </form>
                            <div className="column is-3 has-text-centered">
                                <input ref={(fecha) => { this.fecha = fecha }} className="input has-text-weight-normal has-text-white sin-bordes is-rounded infoco" type="date" name="fecha" />
                            </div>
                        </div>
                    }
                    {this.state.reps.length > 0 ?
                        <div className="columns box sin-pad marbot" style={{ alignItems: "center", backgroundColor: '#6320ee' }}>
                            <div className="column is-7 is-offset-2 has-text-centered">
                                <h6 className="title is-6 has-text-white">
                                    REPARACIÓN
                            </h6>
                            </div>
                            <div className="column is-3 has-text-centered">
                                <h6 className="title is-6 has-text-white">FECHA (d/m/a)</h6>
                            </div>
                        </div>
                        :
                        <div className="columns is-centered sin-pad" style={{ alignItems: "center" }}>
                            <div className="column is-4 has-text-centered box" style={{ backgroundColor: '#6320ee' }}>
                                <h6 className="title is-6 has-text-white">
                                    {this.state.carga}
                                </h6>
                            </div>
                        </div>
                    }
                    {all}
                </div>
            </div>
        );
    }
}

export default Modificar;