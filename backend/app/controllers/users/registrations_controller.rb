class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render_success(serialize_resource(resource, UserSerializer), 'Signed up sucesfully.', :ok)
    else
      render_error("User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}")
    end
  end
end
