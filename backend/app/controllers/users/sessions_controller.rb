class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    refresh_token = RefreshTokens::Create.call(resource).last

    response.set_header(
      'X-Refresh-Token',
      refresh_token
    )

    render_success(
      serialize_resource(resource, UserSerializer)
    )
  end

  def respond_to_on_destroy
    if current_user
      RefreshToken.where(user: current_user).destroy_all
      render_success(nil, 'Logged out successfully.')
    else
      render_error("Couldn't find an active session.", :unauthorized)
    end
  end
end
