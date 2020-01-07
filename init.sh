#!/bin/bash
rm -r ~/.nsd
rm -r ~/.nscli
nsd init moniker --chain-id namechain
echo "1234567890" | nscli keys add faucet
#echo "1234567890" | nscli keys add faucet --recover mnemonic.txt
#echo "1234567890" | (echo "1234567890" | nscli keys add faucet --recover)
nsd add-genesis-account $(nscli keys show faucet -a) 1000nametoken,100000000stake
nscli config chain-id namechain
nscli config output json
nscli config indent true
nscli config trust-node true