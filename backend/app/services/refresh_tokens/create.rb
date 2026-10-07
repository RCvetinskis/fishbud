module RefreshTokens
  class Create
    def self.call(user)
      raw_token = SecureRandom.urlsafe_base64(64)

      refresh_token = RefreshToken.create!(
        user: user,
        token_digest: Digest::SHA256.hexdigest(raw_token),
        expires_at: 30.days.from_now
      )

      [refresh_token, raw_token]
    end
  end
end
