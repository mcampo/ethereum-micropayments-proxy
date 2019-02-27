pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/Math.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract Subscriptions {
  using ECDSA for bytes32;

  struct Channel {
    bytes32 nonce;
    uint deposit;
    uint creditPrice;
  }

  address providerAddress;
  uint currentCreditPrice;
  mapping (address => Channel) channels;
  
  constructor(
    address _providerAddress,
    uint _creditPrice
  ) public {
    providerAddress = _providerAddress;
    currentCreditPrice = _creditPrice;
  }
  
  function openChannel() external payable {
    require(msg.value >= currentCreditPrice, "Transfered value must be greater or equal than current credit price");
    require(!hasOpenChannel(msg.sender), "Sender already has an open channel");

    Channel memory channel = Channel(
      generateNonce(),
      msg.value,
      currentCreditPrice
    );

    channels[msg.sender] = channel;
  }

  function getProviderAddress() public view returns (address) {
    return providerAddress;
  }
  
  function getChannel(address consumerAddress) public view returns (bytes32 nonce, uint deposit, uint creditPrice) {
    Channel memory channel;
    channel = channels[consumerAddress];
    
    return (channel.nonce, channel.deposit, channel.creditPrice);
  }

  function verifySignature(address consumerAddress, bytes32 nonce, uint signedCredits, bytes signature) internal pure {
    // Verify the consumerAddress has signed the promise
    bytes32 messageHash = keccak256(abi.encodePacked(nonce, signedCredits));
    address signer = messageHash.toEthSignedMessageHash().recover(signature);
    require(signer == consumerAddress, "Invalid signature");
  }

  function closeChannel(address consumerAddress, uint signedCredits, bytes signature) external onlyProvider {
    require(hasOpenChannel(consumerAddress), "consumerAddress does not have an open channel");

    Channel memory channel;
    channel = channels[consumerAddress];

    verifySignature(consumerAddress, channel.nonce, signedCredits, signature);

    uint channelCredits = SafeMath.div(channel.deposit, channel.creditPrice);
    uint creditsToConsume = Math.min(channelCredits, signedCredits);

    uint valueToTransfer = SafeMath.mul(creditsToConsume, channel.creditPrice);
    providerAddress.transfer(valueToTransfer);
    if (valueToTransfer < channel.deposit) {
      consumerAddress.transfer(SafeMath.sub(channel.deposit, valueToTransfer));
    }
    
    delete channels[consumerAddress];
  }

  function hasOpenChannel(address consumerAddress) internal view returns (bool) {
    return channels[consumerAddress].deposit > 0;
  }

  function generateNonce() internal view returns (bytes32) {
    return keccak256(abi.encodePacked(block.number));
  }

  modifier onlyProvider() {
    require(msg.sender == providerAddress, "Only provider can execute this function");
    _;
  }
}
