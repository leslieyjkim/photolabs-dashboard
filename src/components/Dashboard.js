import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import classnames from "classnames";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos,
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics,
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads,
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads,
  }
];


class Dashboard extends Component {
  state = { loading : true, focused: null, photos: [], topics: [] }; 
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

      const urlsPromise = [
        "/api/photos",
        "/api/topics",
      ].map(url => fetch(url).then(response => response.json()));

      //fetching and parsing are both asynchronous. 
      //We will need to wrap urlsPromise in a Promise.all. 
      //Now, when the component mounts we will request our data. 
      //After the data returns, we use this.setState to merge it into the existing state object.

      Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });

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
      <Panel key={panel.id} label={panel.label} value={panel.getValue(this.state)} onSelect={()=>this.selectPanel(panel.id)} />)
    );

    return <main className={dashboardClasses}>{panels}</main>;
  };
}

export default Dashboard;
