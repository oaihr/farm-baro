import React, { useEffect, useState } from "react";

// 결제 상품 정보 (실제로는 백엔드 API에서 가져와야 합니다)
const item = {
  id: "shoes",
  name: "신발",
  price: 1000,
  currency: "KRW",
};

// 메인 컴포넌트
export function TestKG() {
  const [isIamportLoaded, setIsIamportLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({
    status: "IDLE",
    message: "",
  });

  // (수정) PortOne SDK 대신 아임포트 SDK를 로드합니다.
  useEffect(() => {
    // SDK가 이미 로드되었는지 확인
    if (typeof window.IMP !== 'undefined') {
      setIsIamportLoaded(true);
      return;
    }

    // 새로운 스크립트 태그를 생성합니다.
    const script = document.createElement("script");
    // (수정) 아임포트 SDK v1 URL로 변경
    script.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";
    script.async = true;
    
    // 스크립트 로딩 완료 시 상태를 업데이트합니다.
    script.onload = () => {
      // (수정) 로드 성공 시 IMP.init()으로 아임포트를 초기화합니다.
      const IMP = window.IMP;
      IMP.init("imp13778606"); // 'imp01234567' 대신 아임포트에서 발급받은 '가맹점 식별코드'를 입력하세요.
      setIsIamportLoaded(true);
      console.log("아임포트 SDK is successfully loaded.");
    };

    // 스크립트 로딩 실패 시 에러를 기록합니다.
    script.onerror = () => {
      console.error("Failed to load Iamport SDK.");
      setPaymentStatus({
        status: "FAILED",
        message: "아임포트 SDK를 로드하는 데 실패했습니다. 네트워크 연결을 확인해 주세요.",
      });
    };

    // 스크립트를 문서의 head에 추가하여 로드를 시작합니다.
    document.head.appendChild(script);

    // 컴포넌트 언마운트 시 스크립트 태그를 제거합니다.
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!isIamportLoaded) {
      setPaymentStatus({
        status: "FAILED",
        message: "아임포트 SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.",
      });
      return;
    }

    setPaymentStatus({ status: "PENDING", message: "" });
    
    const IMP = window.IMP;

    // (수정) PortOne 대신 아임포트의 IMP.request_pay 함수를 사용합니다.
    // 이전 답변에서 설명드렸던 PG, merchant_uid, buyer_name 등 필수 파라미터들을 포함합니다.
    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest", // 테스트 모드용 KG이니시스 PG 코드
        pay_method: "card",
        merchant_uid: `order_no_${new Date().getTime()}`, // 상점에서 생성한 고유 주문번호
        name: item.name,
        amount: item.price,
        buyer_email: "test@example.com",
        buyer_name: "홍길동",
        buyer_tel: "010-1234-5678",
      },
      async (rsp) => {
        // 결제 완료 후 실행되는 콜백 함수
        if (rsp.success) {
          
          console.log("결제 성공. imp_uid:", rsp.imp_uid);
          setPaymentStatus({
            status: "PAID",
            message: "결제가 성공적으로 완료되었습니다.",
          });
        } else {
          // 결제 실패 또는 취소 시
          console.error("결제 실패:", rsp.error_msg);
          setPaymentStatus({
            status: "FAILED",
            message: rsp.error_msg,
          });
        }
      }
    );
  };

  const isWaitingPayment = paymentStatus.status === "PENDING";
  const handleClose = () => setPaymentStatus({ status: "IDLE", message: "" });

  return (
    <>
      <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
          <form onSubmit={handlePayment}>
            <article>
              <div className="item flex items-center justify-center gap-4 mb-4">
                <div className="item-image rounded-md">
                  <img
                    src="https://placehold.co/100x100/A0AEC0/000000?text=Shoes"
                    alt="상품 이미지"
                    className="rounded-lg"
                  />
                </div>
                <div className="item-text text-left">
                  <h5 className="text-xl font-bold">{item.name}</h5>
                  <p className="text-gray-600">{item.price.toLocaleString()}원</p>
                </div>
              </div>
              <div className="price flex justify-between items-center text-lg font-semibold mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="text-gray-600">총 구입 가격</label>
                <span>{item.price.toLocaleString()}원</span>
              </div>
            </article>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isWaitingPayment || !isIamportLoaded}
            >
              {/* (수정) 로딩 상태 메시지 변경 */}
              {!isIamportLoaded ? "결제 로딩 중..." : (isWaitingPayment ? "결제 처리 중..." : "결제")}
            </button>
          </form>
        </div>
      </main>

      {paymentStatus.status === "FAILED" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <header className="mb-4">
              <h1 className="text-2xl font-bold text-red-600">결제 실패</h1>
            </header>
            <p className="text-gray-700 mb-6">{paymentStatus.message}</p>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {paymentStatus.status === "PAID" && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <header className="mb-4">
              <h1 className="text-2xl font-bold text-green-600">결제 성공</h1>
            </header>
            <p className="text-gray-700 mb-6">결제에 성공했습니다.</p>
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TestKG;