import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}



export default function OrderScreen() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const checkoutHandler = async (amount) => {

    const {data:{key}} = await axios.get("http://localhost:5000/api/getrazorpaykey")
    // const {data:{order_id, payment_id, signature}} = await axios.get("http://localhost:5000/api/getpayment");

    // const {data} = await axios.post("http://localhost:5000/api/savepayment",
    // {
    //   rzrpay_order_id: order_id,
    //   rzrpay_payment_id: payment_id,
    //   rzrpay_signature: signature,
    //   orderItems: cart.cartItems,
    //   shippingAddress: cart.shippingAddress,
    //   amount: cart.totalPrice,
    // })
    
    const { data:{order} } = await axios.post("http://localhost:5000/api/checkout", {
      amount
    })

    // const { data } = await axios.post('http://localhost:5000/api/paymentverification',
    // {
    //     orderItems: cart.cartItems,
    //     shippingAddress: cart.shippingAddress,
    //     amount: cart.totalPrice,
    // },
    // )

    const options = {
      key: key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: JSON.parse(localStorage.getItem('shippingAddress')).fullName,
      // orderItems: cart.cartItems,
      // shippingAddress: cart.shippingAddress,
      // amount: cart.totalPrice,
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "http://localhost:5000/api/paymentverification",
      prefill: {
          name: JSON.parse(localStorage.getItem('shippingAddress')).fullName,
          email: JSON.parse(localStorage.getItem('userInfo')).email,
          contact: "9999999999"
      },
      notes: {
          address: "Razorpay Corporate Office"
      },
      theme: {
          color: "#528FF0"
      }
  };
  const rzp1 = new window.Razorpay(options);
      rzp1.open();
  }

  // const placeOrderHandler = async () => {
  //   try {
  //     dispatch({ type: 'CREATE_REQUEST' });

  //     const { data } = await axios.post(
  //       '/api/orders',
  //       {
  //         orderItems: cart.cartItems,
  //         shippingAddress: cart.shippingAddress,
  //         paymentMethod: cart.paymentMethod,
  //         itemsPrice: cart.itemsPrice,
  //         shippingPrice: cart.shippingPrice,
  //         taxPrice: cart.taxPrice,
  //         totalPrice: cart.totalPrice,
  //       },
  //       {
  //         headers: {
  //           authorization: `Bearer ${userInfo.token}`,
  //         },
  //       }
  //     );
  //     ctxDispatch({ type: 'CART_CLEAR' });
  //     dispatch({ type: 'CREATE_SUCCESS' });
  //     localStorage.removeItem('cartItems');
  //     navigate(`/order/${data.order._id}`);
  //   } catch (err) {
  //     dispatch({ type: 'CREATE_FAIL' });
  //     toast.error(getError(err));
  //   }
  // };

  // function createOrder(data, actions) {
  //   return actions.order
  //     .create({
  //       purchase_units: [
  //         {
  //           amount: { value: order.totalPrice },
  //         },
  //       ],
  //     })
  //     .then((orderID) => {
  //       return orderID;
  //     });
  // }

  // function onApprove(data, actions) {
  //   return actions.order.capture().then(async function (details) {
  //     try {
  //       dispatch({ type: 'PAY_REQUEST' });
  //       const { data } = await axios.put(
  //         `/api/orders/${order._id}/pay`,
  //         details,
  //         {
  //           headers: { authorization: `Bearer ${userInfo.token}` },
  //         }
  //       );
  //       dispatch({ type: 'PAY_SUCCESS', payload: data });
  //       toast.success('Order is paid');
  //     } catch (err) {
  //       dispatch({ type: 'PAY_FAIL', payload: getError(err) });
  //       toast.error(getError(err));
  //     }
  //   });
  // }
  // function onError(err) {
  //   toast.error(getError(err));
  // }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div style={{color: "white"}}>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3" style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3" style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>{"Method: "}</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3" style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id} style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>₹{item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3" style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>₹{order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                  <Row>
                    <Col>Tax</Col>
                    <Col>₹{order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>₹{order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        {/* <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons> */}
                        <Button type="button" style={{width: "100%", backgroundColor: "dodgerblue"}} onClick={()=>{checkoutHandler(order.totalPrice.toFixed(2))}}>Pay Now</Button>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item style={{backgroundColor: "rgb(20, 20, 20)", color: "white"}}>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
