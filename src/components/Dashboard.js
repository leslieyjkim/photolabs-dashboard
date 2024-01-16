import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];


class Dashboard extends Component {
  state = { loading : false, focused: null }; 
   /* Binding 1. Instance Method */
//    selectPanel(id) {
//     this.setState({
//      focused: id
//     });
//    } 
// }

   /* Binding 2. Class Property with Arrow Function */
   selectPanel = id => {
    this.setState((previousState)=>({
      focused: previousState.focused !== null ? null : id,
    }));
  };

    // save to localStorage.
    // if the values change, we write the value to localStorage.
   componentDidMount() {
      const focused = JSON.parse(localStorage.getItem("focused"));

      if (focused) {
       this.setState({ focused });
     }
    }

   componentDidUpdate(previousProps, previousState) {
     if (previousState.focused !== this.state.focused) {
       localStorage.setItem("focused", JSON.stringify(this.state.focused)); 
     }
    }
    //1.use the JSON.stringify function to convert our values before writing them to the localStorage.
    //2.When we get the values out of storage, we use the JSON.parse function to convert the string back to JavaScript values. 
    //3.This process of serialization allows us to save more complex data types in localStorage.


    render() {
    const dashboardClasses = classnames("dashboard", {"dashboard--focused": this.state.focused});

    if(this.state.loading) {
      return <Loading/>;
    }

    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
    .map((panel) => (
      <Panel key={panel.id} id={panel.id} label={panel.label} value={panel.value} onSelect={(event)=>this.selectPanel(panel.id)} />)
    );

    return <main className={dashboardClasses}>{panels}</main>;
  };
}

export default Dashboard;
