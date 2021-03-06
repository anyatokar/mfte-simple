import React, { useState, useEffect } from "react";
import { Button, Modal, Nav, Tab, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Login from "../auth_components/Login";
import IPage from '../interfaces/IPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useCallback } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';
import IBuilding from "../interfaces/IBuilding";
import MapTab from "../components/MapTab";
import SavedHomesList from '../components/SavedHomesList';
import { Spinner } from "react-bootstrap"

const SavedByUserPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const { currentUser } = useAuth() as any

  const ref = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes")
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getSavedBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setSavedBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getSavedBuildings()}, [getSavedBuildings]);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      {
        loading && <Spinner animation="border" variant="warning" />
      }
      <Tab.Container id="sidebar" defaultActiveKey="list">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab">Map</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="list" className="tab">List</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="map">
              <MapTab savedBuildings={savedBuildings}/>
            </Tab.Pane>
            <Tab.Pane eventKey="list">
              <SavedHomesList savedBuildings={savedBuildings}/>
            </Tab.Pane>

          </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  )
}

export default withRouter(SavedByUserPage);
