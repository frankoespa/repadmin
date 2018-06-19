import React, { Component } from "react";
import swal from 'sweetalert';
import tippy from 'tippy.js';
const Datastore = require('nedb');

class Agregar extends Component {
    constructor(props) {
        super(props);
        this.db = new Datastore({ filename: 'src/data/data.db', autoload: true });
        this.state = {
            _id: "",
            reps: [],
            fcarga: new Date().toLocaleDateString(),
            fact: new Date().toLocaleDateString()
        };
        this.change = this.change.bind(this);
        this.saveItem = this.saveItem.bind(this);
        console.log(this.props.match.url)
    }

    componentDidMount() {
        tippy(this.pat, {
            arrow: true,
            placement: 'bottom',
            arrowType: 'sharp',
            duration: 100,
            animation: 'scale',
            distance: '25',
            trigger: 'click'
        });
        tippy(this.ok, {
            arrow: true,
            placement: 'left',
            arrowType: 'sharp',
            duration: 100,
            animation: 'scale',
            distance: '25'
        })
    }

    change(e) {

        if (this.pat.value.length > 0 && this.pat.value[this.pat.value.length - 1] === ' ') {

            this.pat.value = this.pat.value.trim();
            return

        }

        this.setState({ _id: this.pat.value.toUpperCase() }, () => {
            console.log(this.state._id);

        })

    };

    saveItem() {
        if (this.state._id.length < 6) {
            swal({
                text: 'La patente debe contener 6 dígitos como mínimo',
                icon: 'warning'
            });
            return
        };
        let este = this;
        this.db.findOne({ _id: this.state._id }, function (err, doc) {
            if (doc == null) {
                este.db.insert(este.state, function (err, doc) {
                    swal(`Vehículo guardado: ${este.state._id}`, "Bien hecho, ahora aparecerá en el LISTADO DE VEHÍCULOS y podrás administrarlo", "success").then(() => {
                        este.props.history.push(`/admin/${este.state._id}`)
                    })
                })
            } else {
                swal({
                    title: `El vehículo ${este.state._id} ya se encuentra registrado`,
                    icon: "error"
                }).then(() => {
                    este.pat.focus()
                })

            }
        });

    }

    render() {
        return (
            <div className="container full-h">
                <div className="columns is-centered full-h" style={{ alignItems: "center" }} >
                    <form className="column is-3" onSubmit={(e) => { this.saveItem(); e.preventDefault() }}>
                        <div className="field">
                            <div className="control">
                                <input title="Ingrese la patente y presione ENTER para guardar el vehículo" value={this.state._id} onChange={this.change} className="input is-primary is-medium is-uppercase has-text-white has-text-centered is-rounded" style={{ backgroundColor: '#0c121d' }} type="text" placeholder="Ingresar patente" maxLength="7" ref={(pat) => { this.pat = pat }} />
                            </div>
                        </div>
                    </form>
                </div>
                <img title="Guardar vehículo" onClick={this.saveItem} id="btnok" className="has-background-primary animated pulse infinite" src={"./asset/ok.svg"} ref={(ok) => { this.ok = ok }} />
            </div>
        )
    }
}

export default Agregar
