import {tr, td, hr} from '@cycle/dom';

export default function DeviceTableRow(device) {
  return tr('.device', [
    td(device.name),
    td(device.os),
    td(device.osversion)
  ]);
}
