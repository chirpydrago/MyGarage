import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import Marketplace from './Marketplace';
import Profile from './Profile';

export default function CenteredTabs() {
  
  const [value, setValue] = React.useState(0);

  const handleChange = (e, value) => {
    setValue(value);
  };

  function TabPanel(props) {
    const { children, value, index } = props;
    return (
      <div>{value===index && (<div>{children}</div>)}</div>
        )
      
  }

  return (
    <>
      <Tabs
        value={0}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered>
        <Tab label="Marketplace" />
        <Tab label="Profile" />
      </Tabs>
      <TabPanel value={value} index={0}><Marketplace/></TabPanel>
      <TabPanel value={value} index={1}><Profile/></TabPanel>      
    </>
  )
}