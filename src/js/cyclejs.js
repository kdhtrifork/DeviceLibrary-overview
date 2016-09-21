// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import xs from 'xstream';
import {run} from '@cycle/xstream-run';
import {makeDOMDriver, button, div, h1, table, thead, th, tbody, tr, td, hr} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import DeviceTableRow from './DeviceTableRow';
import SubmitDeviceForm from './SubmitDeviceForm'

function generateFetchDeviceListUrl() {
  return {
    url: 'http://46.101.160.215:1337/devices',
    category: 'devices',
    method: 'GET'
  }
}

function intent(sources, initialList) {
  return {
    refreshButton: sources.DOM.select('.refresh')
      .events('click')
      .map(e => generateFetchDeviceListUrl())
      .startWith(generateFetchDeviceListUrl())
  }
}

function model (sources) {
  return sources.HTTP.select('devices')
    .flatten()
    .map(res => res.body)
    .startWith(null);
}

function view(devices$) {
  return devices$.map( (devices) => {
    return div([
      h1("Devices"),
      button('.refresh', 'Refresh List'),
      table('.devices.table.table-striped', [
        thead([
          tr([
            th("Device Name"),
            th("OS"),
            th("OS Version"),
            th("Status")
          ])
        ]),
        tbody(
           devices === null ? [] : devices.map( (device) => {
             return DeviceTableRow(device);
           })
         )
      ]),
    ]);
  });
}

function main(sources) {
  const actions = intent(sources);
  const SubmitDeviceForm$ = SubmitDeviceForm(sources);

  const state$ = model(sources);
  const vdom$ = xs.combine(view(state$), SubmitDeviceForm$.DOM)
    .map( ([listView, formView]) => {
      return div('.container', [
        listView,
        hr(),
        h1("Create new Devices"),
        formView
      ])
    });

  const requests$ = xs.merge(
    actions.refreshButton,
    SubmitDeviceForm$.HTTP
  );

  return {
    DOM: vdom$,
    HTTP: requests$
  };
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
};

run(main, drivers);
