module Users
  class AuthController < ApplicationController
    before_action :authenticate_user!, only: %i[current_user]

    def refresh
      raw_token = request.headers['X-Refresh-Token']

      return render_error('Refresh token missing', :unauthorized) unless raw_token.present?

      digest = Digest::SHA256.hexdigest(raw_token)

      refresh_token = RefreshToken.find_by(token_digest: digest)

      return render_error('Refresh token expired', :unauthorized) if refresh_token.nil? || refresh_token.expired?

      user = refresh_token.user

      refresh_token.destroy!

      new_refresh_token = RefreshTokens::Create.call(user).last

      jwt = Warden::JWTAuth::UserEncoder.new.call(
        user,
        :user,
        nil
      ).first

      response.set_header('Authorization', "Bearer #{jwt}")
      response.set_header('X-Refresh-Token', new_refresh_token)

      render_success(
        serialize_resource(user, UserSerializer)
      )
    end

    def me
      render_success(current_user, UserSerializer)
    end
  end
end
