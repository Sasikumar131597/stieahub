import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.errorCode}>404</h1>
            <p style={styles.message}>Sorry, we couldn't find this page.</p>
            <p style={styles.subMessage}>But don’t worry, you can explore plenty of other dashboards from our homepage.</p>
            <button style={styles.button} onClick={() => navigate('/')}>
                Back to homepage
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
    },
    errorCode: {
        fontSize: '120px',
        fontWeight: 'bold',
        color: '#6c757d',
        margin: '0',
    },
    message: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#212529',
        margin: '10px 0',
    },
    subMessage: {
        fontSize: '16px',
        color: '#6c757d',
        margin: '0 0 20px 0',
    },
    button: {
        backgroundColor: '#0d6efd',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default NotFoundPage;