// SPDX-Licence-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pool is Ownable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  IERC20 public token;
  IERC20 public rewardToken;
  uint256 public _totalSupply;
  mapping(address => uint256) private _balances;

  event Deposited(address indexed user, uint256 amount);

  constructor(
    address _token,
    address _rewardToken
  ) {
    token = IERC20(_token);
    rewardToken = IERC20(_rewardToken);
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }
  function balanceOf(address _account) public view returns (uint256) {
    return _balances[_account];
  }

  function deposit(uint256 _amount) public returns (bool) {
    // require _amount > 0
    _totalSupply = _totalSupply.add(_amount);
    _balances[msg.sender] = _balances[msg.sender].add(_amount);

    token.safeTransferFrom(msg.sender, address(this), _amount);

    // mint rewardToken

    emit Deposited(msg.sender, _amount);
    return true;
  }
}