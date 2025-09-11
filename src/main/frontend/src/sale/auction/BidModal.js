import React, { useState } from 'react';
import './BidModal.css';
import Alert from './Alert';

function BidModal({ isOpen, onClose, onBid, currentBid, initialPrice, totalBalance, bidDeposit, isAuctionActive }) {

    const [displayBid, setDisplayBid] = useState('');
    const [numericBid, setNumericBid] = useState(0);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        const removedCommaValue = value.replace(/,/g, '');

        if (!isNaN(removedCommaValue)) {

            // 콤마와 공백 제거된 숫자로 업데이트
            setNumericBid(parseInt(removedCommaValue, 10) || 0);

            // 문자열로 변환하고 콤마 추가
            setDisplayBid(removedCommaValue.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        }
    };

    const showAlert = (message) => {
        setAlertMessage(message);
        setIsAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };

    const handleBidSubmit = () => {
        if (!isAuctionActive) {
            showAlert('이미 종료된 경매입니다.');
            return;
        }
        
        // 유효성 검사
        if (numericBid < initialPrice) {
            showAlert(`입찰 금액은 ${initialPrice.toLocaleString()}원 이상이어야 합니다`);
            setDisplayBid('');
            return;
        }
        if (numericBid <= currentBid) {
            showAlert('현재 입찰가보다 높은 금액을 입력해 주세요');
            setDisplayBid('');
            return;
        }

        const availableBalance = totalBalance - bidDeposit;
        const requiredBalance = numericBid * 0.1;

        if (availableBalance < requiredBalance) {
            showAlert(`입찰을 위해 필요한 예치금이 부족합니다. (필요 예치금: ${requiredBalance.toLocaleString()}원)`);
            return;
        }

        onBid(numericBid);
        showAlert('입찰이 성공적으로 완료되었습니다.');

        //onClose();
        setDisplayBid('');
        setNumericBid(0);
    }

    const handleSuccessAlertClose = () => {
        setIsAlertOpen(false);
        setDisplayBid('');
        setNumericBid(0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-info'>
                    <h3>입찰 금액 입력</h3>
                    <p> 현재 입찰가 : <span className='modal-info-price'>{currentBid.toLocaleString()}</span> 원</p>
                    <p>입찰가능금액 : <span className='modal-info-price modal-info-available'>{((totalBalance - bidDeposit)*10).toLocaleString()}</span> 원</p>
                    <div className='modal-input'>
                        <input
                            type="text"
                            value={displayBid}
                            onChange={handleInputChange}
                            placeholder="입찰 금액 (원)"
                            className="bid-input"
                        />
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose} className="close-button">취소</button>
                    <button onClick={handleBidSubmit} className="submit-button">입찰하기</button>
                </div>

                <Alert 
                    message={alertMessage} 
                    isOpen={isAlertOpen} 
                    onClose={handleCloseAlert} 
                    onComplete={handleSuccessAlertClose}
                />
            </div>
        </div>
    );
}

export default BidModal;