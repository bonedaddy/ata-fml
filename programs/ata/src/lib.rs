use anchor_lang::prelude::*;

#[program]
pub mod ata {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
    pub fn run(ctx: Context<Run>) -> ProgramResult {
        let (key, nonce) = get_associated_token_address_and_bump_seed(
            ctx.accounts.first_ata.key,
            ctx.accounts.token_mint.key,
            ctx.accounts.token_program.key,
        );
        assert_eq!(*ctx.accounts.second_ata.key, key);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct Run<'info> {
    #[account(mut, signer)]
    pub authority: AccountInfo<'info>,
    #[account(mut)]
    pub first_ata: AccountInfo<'info>,
    #[account(mut)]
    pub second_ata: AccountInfo<'info>,
    #[account(mut)]
    pub token_mint: AccountInfo<'info>,
    pub token_program: AccountInfo<'info>,
}


pub fn get_associated_token_address_and_bump_seed(
    wallet_address: &Pubkey,
    spl_token_mint_address: &Pubkey,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    get_associated_token_address_and_bump_seed_internal(
        wallet_address,
        spl_token_mint_address,
        program_id,
        &spl_token::id(),
    )
} 

/// Derives the associated token account address for the given wallet address and token mint
pub fn get_associated_token_address(
    wallet_address: &Pubkey,
    spl_token_mint_address: &Pubkey,
) -> Pubkey {
    get_associated_token_address_and_bump_seed(wallet_address, spl_token_mint_address, &spl_token::id()).0
}



fn get_associated_token_address_and_bump_seed_internal(
    wallet_address: &Pubkey,
    spl_token_mint_address: &Pubkey,
    program_id: &Pubkey,
    token_program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            &wallet_address.to_bytes(),
            &token_program_id.to_bytes(),
            &spl_token_mint_address.to_bytes(),
        ],
        program_id,
    )
}
