import React, { useState } from 'react';

const CorsTest = () => {
  const [pingResult, setPingResult] = useState('');
  const [echoResult, setEchoResult] = useState('');
  const [loginResult, setLoginResult] = useState('');

  const testPing = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/test/ping', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setPingResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setPingResult(`Error: ${error.message}`);
    }
  };

  const testEcho = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/test/echo', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'Hello from frontend!' }),
      });
      const data = await response.json();
      setEchoResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setEchoResult(`Error: ${error.message}`);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        }),
      });
      const data = await response.text();
      setLoginResult(`Status: ${response.status}, Response: ${data}`);
    } catch (error) {
      setLoginResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>CORS 테스트</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>1. Ping 테스트 (GET)</h3>
        <button onClick={testPing} style={{ marginRight: '10px' }}>
          Ping 테스트
        </button>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {pingResult || '결과가 여기에 표시됩니다...'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>2. Echo 테스트 (POST)</h3>
        <button onClick={testEcho} style={{ marginRight: '10px' }}>
          Echo 테스트
        </button>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {echoResult || '결과가 여기에 표시됩니다...'}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>3. 로그인 테스트 (POST)</h3>
        <button onClick={testLogin} style={{ marginRight: '10px' }}>
          로그인 테스트
        </button>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {loginResult || '결과가 여기에 표시됩니다...'}
        </pre>
      </div>

      <div style={{ 
        background: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '4px',
        border: '1px solid #4caf50'
      }}>
        <h4>테스트 방법:</h4>
        <ol>
          <li>Spring Boot 애플리케이션이 8080 포트에서 실행 중인지 확인</li>
          <li>각 버튼을 클릭하여 CORS 오류가 발생하는지 확인</li>
          <li>성공하면 JSON 응답이 표시됩니다</li>
          <li>실패하면 오류 메시지가 표시됩니다</li>
        </ol>
      </div>
    </div>
  );
};

export default CorsTest;
