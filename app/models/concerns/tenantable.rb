module Tenantable
  extend ActiveSupport::Concern

  included do
    has_one :tenant, as: 'model', dependent: :destroy
    after_create :create_tenant
    before_destroy :delete_tenant

    def tenant_key
      self.uuid
    end

    private def create_tenant
      Tenant.create(key: tenant_key, model: self)
      Apartment::Tenant.create(tenant_key)
    end

    private def delete_tenant
      Apartment::Tenant.drop(tenant_key)
    end
  end
end
