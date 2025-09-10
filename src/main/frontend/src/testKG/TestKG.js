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
    const [isPortOneLoaded, setIsPortOneLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState({
        status: "IDLE",
        message: "",
    });

    // PortOne SDK를 동적으로 로드하고 상태를 업데이트하는 useEffect 훅입니다.
    useEffect(() => {
        // SDK가 이미 로드되었으면 상태를 true로 설정하고 종료합니다.
        if (typeof window.IMP !== 'undefined') {
            setIsPortOneLoaded(true);
            return;
        }

        // 새로운 스크립트 태그를 생성합니다.
        const script = document.createElement("script");
        script.src = "https://cdn.portone.io/v2/browser-sdk/portone-browser-sdk.js";
        script.async = true;

        // 스크립트 로딩 완료 시 상태를 업데이트합니다.
        script.onload = () => {
            setIsPortOneLoaded(true);
            console.log("PortOne SDK is successfully loaded.");
        };

        // 스크립트 로딩 실패 시 에러를 기록합니다.
        script.onerror = () => {
            console.error("Failed to load PortOne SDK.");
            setPaymentStatus({
                status: "FAILED",
                message: "PortOne SDK를 로드하는 데 실패했습니다. 네트워크 연결을 확인해 주세요.",
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

        if (!isPortOneLoaded) {
            setPaymentStatus({
                status: "FAILED",
                message: "PortOne SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.",
            });
            return;
        }

        setPaymentStatus({ status: "PENDING", message: "" });

        // Step 1: 클라이언트에서 PortOne SDK를 이용해 결제를 요청합니다.
        window.IMP.request_pay(
            {
                channelKey: "channel-key-96191d24-27f0-4277-ba74-240d192d6fb8",
                pay_method: "card",
                merchant_uid: `order_no_${new Date().getTime()}`, // 상점에서 생성한 고유 주문번호
                name: item.name,
                amount: item.price,
                buyer_email: "test@portone.io",
                buyer_name: "구매자이름",
                buyer_tel: "010-1234-5678",
            },
            async (rsp) => {
                // 결제 완료 후 실행되는 콜백 함수
                if (rsp.success) {
                    // **(수정됨)** 백엔드 검증 로직을 제거하고 프론트엔드에서 결제 성공을 직접 처리합니다.
                    console.log("프론트엔드에서 결제 성공 처리 완료. 결제 ID:", rsp.imp_uid);
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
                            disabled={isWaitingPayment || !isPortOneLoaded}
                        >
                            {!isPortOneLoaded ? "결제 로딩 중..." : (isWaitingPayment ? "결제 처리 중..." : "결제")}
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