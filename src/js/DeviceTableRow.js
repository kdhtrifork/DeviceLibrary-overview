import {tr, td, hr, pre} from '@cycle/dom';

export default function DeviceTableRow(device) {
  return tr('.device', [
    td(device.name),
    td(device.os),
    td(device.osversion),
    td([
      pre(JSON.stringify(device.borrowStatus, null, 2))
    ])
  ]);
}
