import './App.css';
import {useEffect, useState} from 'react';
import Amplify, {API , graphqlOperation} from 'aws-amplify';
import awsConfig from './aws-exports';
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import {listLists} from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeader from './components/headers/MainHeaders';
import Lists from './components/Lists/Lists';
import {Button, Container, Icon, Modal} from "semantic-ui-react";
Amplify.configure(awsConfig);

function App() {
    const [lists, setLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    async function fetchList() {
        const { data } = await API.graphql(graphqlOperation(listLists));
        setLists(data.listLists.items);
    }
    useEffect(() => {
        fetchList();
    },[]);

    function openModal() {
        setIsModalOpen(true);
    }

  return (
      <AmplifyAuthenticator>
          <AmplifySignOut />
          <Button className='floatingButtom' onClick={openModal}>
              <Icon name='plus' className='floatingButtom_icon'/>
          </Button>
              <Container>
                <div className='App'>
                    <MainHeader />
                    <Lists lists={lists} />
                </div>
              </Container>
          <Modal open={isModalOpen} dimmer='blurring'>
              <Modal.Header>Create Your List</Modal.Header>
              <Modal.Content>Form to be added later</Modal.Content>
              <Modal.Actions>
                  <Button negative>Cancel</Button>
                  <Button positive>Save</Button>
              </Modal.Actions>
          </Modal>
          </AmplifyAuthenticator>
  );
}

export default App;

