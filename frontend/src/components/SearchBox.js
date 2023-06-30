import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <Form style={{width: "500px"}} className="d-flex me-auto" onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          style={{marginLeft: "100px", width: "100px", backgroundColor: "rgb(40, 40, 40)", color: "white", border: "0.5px solid dodgerblue"}}
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search products..."
          aria-label="Search Products"
          aria-describedby="button-search"
        ></FormControl>
        <Button variant="outline-primary" type="submit" id="button-search" className='bg-primary'>
          <i className="fas fa-search"></i>
        </Button>
      </InputGroup>
    </Form>
  );
}
