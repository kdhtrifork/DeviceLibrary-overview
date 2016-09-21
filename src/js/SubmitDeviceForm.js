import xs from 'xstream';
import {form, div, input, select, option, label, h2, pre, button} from '@cycle/dom';

function intent(DOMSources) {
  const deviceName$ = DOMSources.select('.device-name')
    .events('input')
    .map(ev => ev.target.value)
    .startWith("");

  const deviceOS$ = DOMSources.select('.device-os')
    .events('input')
    .map(ev => ev.target.value)
    .startWith(undefined);

  const submit$ = DOMSources.select('form#deviceForm')
    .events('submit')
    .map(ev => {
      ev.preventDefault();
      return true;
    })
    .startWith(false);

  return {
    deviceName$,
    deviceOS$,
    submit$
  }
}

function request$(actions$) {
  return xs.combine(
    actions$.deviceName$,
    actions$.deviceOS$,
    actions$.submit$
  )
  .map( (combined) => {
    return {
      deviceName: combined[0],
      deviceOS: combined[1],
      submit: combined[2]
    };
  })
  .filter((state) => {
    return (state.deviceName !== '' && state.submit === true);
  })
  .map((state) => {
    return {
      method: 'POST',
      url: 'http://46.101.160.215:1337/devices',
      headers: {
        'Content-Type': 'application/json'
      },
      send: {
        name: state.deviceName,
        os: state.deviceOS
      }
    }
  })
}

function view(state$) {
  return state$.startWith(null).map( state => {
    return div([
      form('#deviceForm', [
        div('.form-group.device-form', [
          label('Device Name'),
          input('.form-control.device-name', {attrs: {type: 'text', placeholder: 'Enter an device name'}})
        ]),
        div('.form-group', [
          label('Device OS'),
          select('.form-control.device-os', [
            option({
              attrs: {
                disabled: true,
                selected: true
              }}, `Select OS`),
            option("iOS"),
            option("Android")
          ])
        ]),
        button({
          attrs: {
            type: 'submit',
          },
          className: '.submit',
        }, 'Submit')
      ])
    ])
  });
}

export default function SubmitDeviceForm(sources) {
  const actions$ = intent(sources.DOM);
  const request = request$(actions$);
  return {
    DOM: view(request),
    HTTP: request
  }
}
