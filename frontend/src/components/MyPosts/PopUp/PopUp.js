import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './PopUp.css';
import getAddressFromCoordinates from '../../../utils/utils';

const PopUpModal = (props) => {
  const { title, description, price, location, postalCode } = props.post;
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getAddressFromCoordinates(location.lat, location.lon);
      setAddress(address);
    };

    fetchAddress();
  }, [location.lat, location.lon]);

  return (
    <Modal
      {...props}
      dialogClassName="my-modal-dialog"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title id="contained-modal-title-vcenter" className="modal-title">
          <strong>{title}</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <h4 className="modal-text">Description: {description}</h4>
        <h4 className="modal-text">Price: ${price}</h4>
        <h4 className="modal-text">Address: {address}</h4>
        <h4 className="modal-text">Postal Code: {postalCode}</h4>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button onClick={props.onHide} className="modal-button">Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PopUpModal;
