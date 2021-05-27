import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home, About, Header, Page } from './App';
import { pages } from './content.js';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
      <BrowserRouter>
          <Header/>
          <hr class="slant"/>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/about">
              <Page mdFile={pages.about} />
            </Route>
            <Route exact path="/tf1">
              <Page mdFile={pages.tf1} />
            </Route>
            <Route exact path="/youth">
              <Page mdFile={pages.youth} />
            </Route>
            <Route exact path="/journaling">
              <Page mdFile={pages.journaling} />
            </Route>
            <Route exact path="/dontWorkHard">
              <Page mdFile={pages.dontWorkHard} />
            </Route>
            <Route exact path="/universityAssemblyLine">
              <Page mdFile={pages.universityAssemblyLine} />
            </Route>
            <Route exact path="/dirtyHands">
              <Page mdFile={pages.dirtyHands} />
            </Route>
            <Route exact path="/emerson">
              <Page mdFile={pages.emerson} />
            </Route>
            <Route exact path="/adolos">
              <Page mdFile={pages.adolos} />
            </Route>
            <Route exact path="/community">
              <Page mdFile={pages.community} />
            </Route>
            <Route exact path="/choice">
              <Page mdFile={pages.choice} />
            </Route>
            <Route exact path="/solitudeCovid">
              <Page mdFile={pages.solitudeCovid} />
            </Route>
            <Route exact path="/friendship">
              <Page mdFile={pages.friendship} />
            </Route>

          </Switch>
      </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//
reportWebVitals();
