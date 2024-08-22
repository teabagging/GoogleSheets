import { read, utils } from 'xlsx';
import url from './mobile.xls';
import React, { useEffect, useState } from 'react';

const FrameworkData = () => {
  const [fw, setFW] = useState("");

  useEffect(() => { (async() => {
    const wb = read(await (await fetch(url)).arrayBuffer(), { dense: true });
    setFW(utils.sheet_to_html(wb.Sheets["Frameworks"]));
  })(); }, []);
  return ( <div dangerouslySetInnerHTML={{__html: fw}}/> );
};
export default FrameworkData;
