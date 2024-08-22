import { read, utils } from 'xlsx';
import url from './engines.xls';
import React, { useEffect, useState } from 'react';

const EngineData = () => {
  const [engines, setEngines] = useState("");
  const [binding, setBinding] = useState("");

  useEffect(() => { (async() => {
    const wb = read(await (await fetch(url)).arrayBuffer(), { dense: true });
    setEngines(utils.sheet_to_html(wb.Sheets["Engines"]));
    setBinding(utils.sheet_to_html(wb.Sheets["Bindings"]));
  })(); }, []);
  return ( <>
    <p>The following engines have been tested in their native languages:</p>
    <div dangerouslySetInnerHTML={{__html: engines}}/>
    <p>The following bindings have been tested:</p>
    <div dangerouslySetInnerHTML={{__html: binding}}/>
    <p>Asterisks (✱) in the Windows columns mark tests that were run in Windows Subsystem for Linux (WSL)</p>
  </> );
};
export default EngineData;