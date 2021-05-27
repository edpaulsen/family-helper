import './App.css';
import {useEffect, useState, useReducer} from 'react';
import Amplify, {API , graphqlOperation} from 'aws-amplify';
import awsConfig from './aws-exports';
import {AmplifyAuthenticator, AmplifySignOut} from '@aws-amplify/ui-react';
import {listLists} from './graphql/queries';
import 'semantic-ui-css/semantic.min.css';
import MainHeader from './components/headers/MainHeaders';
import Lists from './components/Lists/Lists';
import {Button, Container, Form, Icon, Modal} from "semantic-ui-react";
import {createList} from "./graphql/mutations";
import {onCreateList} from "./graphql/subscriptions";

Amplify.configure(awsConfig);

const initialState = {
    title: 'test title',
    description: 'test description'
}
function listReducer(state= initialState, action) {
    switch (action.type) {
        case 'DESCRIPTION_CHANGED':
            return {...state, description: action.value}
        case 'TITLE_CHANGED':
            return {...state, title: action.value}
        default:
            console.log('Default action for: ', action)
            return state
    }
}

function App() {

    const [state, dispatch] = useReducer(listReducer, initialState);

    const [lists, setLists] = useState([]);
    const [newList, setNewList] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)

        async function fetchList() {
            const {data} = await API.graphql(graphqlOperation(listLists));
            setLists(data.listLists.items);
            console.log(data);
        }

        useEffect(() => {
            fetchList();
        }, []);

        useEffect(() => {
            if(newList !== ''){
                setLists([newList, ...lists])
    }
        }, [newList])

        function addToList({data}) {
            setNewList(data.onCreateList);
        }

        useEffect(() => {
            let subscription =
                API
                    .graphql(graphqlOperation(onCreateList))
                    .subscribe({
                        next: ({provider, value}) => addToList(value)
                    })
        }, [])

        function toggleModal(shouldOpen) {
            setIsModalOpen(shouldOpen);
    }
        async function saveList() {
            const {title, description} = state;
            const result = await API.graphql(graphqlOperation(createList, {input: {title, description}})
            );
            toggleModal(false)
            console.log('Save data with results: ', result);
        }
  return (
      <AmplifyAuthenticator>

              <Container style={{height: '100vh'}}>
                  <AmplifySignOut />
                  <Button className='floatingButton' onClick={() => toggleModal(true)}>
                      <Icon name='plus' className='floatingButton_icon'/>
                  </Button>
                <div className='App'>
                    <MainHeader />
                    <Lists lists={lists} />
                </div>
              </Container>
          <Modal open={isModalOpen} >
              <Modal.Header>Create Your List</Modal.Header>
              <Modal.Content>
                  <Form>
                      <Form.Input
                          error={true ? false : {content: "Please add a name to your list"}}
                          label=" Title"
                          placeholder="My Pretty List"
                          value={state.title}
                          onChange={(e) => dispatch({ type: 'TITLE_CHANGED', value: e.target.value })}
                      ></Form.Input>
                      <Form.TextArea
                          value={state.description}
                          onChange={(e) => dispatch({ type: 'DESCRIPTION_CHANGED', value: e.target.value })}
                          label='Description'
                          placeholder="Things that my Pretty list is about">
                      </Form.TextArea>
                  </Form>
              </Modal.Content>
              <Modal.Actions>
                  <Button negative onClick={() => toggleModal(false)} >
                      Cancel
                  </Button>
                  <Button positive onClick={saveList} >
                      Save
                  </Button>
              </Modal.Actions>
          </Modal>
          </AmplifyAuthenticator>
  );
}

export default App;

