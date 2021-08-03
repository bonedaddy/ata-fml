"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssociatedTokenAccount = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const serumAssoToken = __importStar(require("@project-serum/associated-token"));
const splToken = __importStar(require("@solana/spl-token"));
const srmCmn = __importStar(require("@project-serum/common"));
describe('ata', () => {
    let provider = anchor.Provider.env();
    // Configure the client to use the local cluster.
    anchor.setProvider(provider);
    let program = anchor.workspace.Ata;
    let testTokenMint;
    it("creates test tokens", () => __awaiter(void 0, void 0, void 0, function* () {
        testTokenMint = yield srmCmn.createMint(provider);
    }));
    let associatedTokenOne;
    let associatedTokenTwo;
    it("creates associated token address (ATA-1)", () => __awaiter(void 0, void 0, void 0, function* () {
        associatedTokenOne = yield createAssociatedTokenAccount(provider, provider.wallet.publicKey, testTokenMint);
        associatedTokenTwo = yield createAssociatedTokenAccount(provider, associatedTokenOne, testTokenMint);
    }));
    it("runs", () => __awaiter(void 0, void 0, void 0, function* () {
        yield program.rpc.initialize({});
    }));
    it('runs the trap', () => __awaiter(void 0, void 0, void 0, function* () {
        const tx = yield program.rpc.run({
            accounts: {
                authority: provider.wallet.publicKey,
                firstAta: associatedTokenOne,
                secondAta: associatedTokenTwo,
                tokenMint: testTokenMint,
                tokenProgram: splToken.TOKEN_PROGRAM_ID,
            }
        });
        console.log("Your transaction signature", tx);
    }));
});
function createAssociatedTokenAccount(provider, // payer
owner, mint) {
    return __awaiter(this, void 0, void 0, function* () {
        let txs = new anchor.web3.Transaction();
        txs.add(yield serumAssoToken.createAssociatedTokenAccount(provider.wallet.publicKey, owner, mint));
        yield provider.send(txs);
        let acct = yield serumAssoToken.getAssociatedTokenAddress(owner, mint);
        return acct;
    });
}
exports.createAssociatedTokenAccount = createAssociatedTokenAccount;
