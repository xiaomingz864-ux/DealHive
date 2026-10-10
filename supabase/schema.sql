-- Amazon Deals Site - Supabase Schema
-- Run this in your Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_name TEXT NOT NULL DEFAULT 'DealHive',
  site_tagline TEXT DEFAULT 'Best Amazon Deals & Coupons',
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  amazon_affiliate_tag TEXT NOT NULL DEFAULT 'yourtag-20',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (site_name, site_tagline, amazon_affiliate_tag, meta_title, meta_description)
VALUES (
  'DealHive',
  'Best Amazon Deals & Coupons Daily',
  'yourtag-20',
  'DealHive – Best Amazon Deals & Coupons',
  'Discover the best Amazon deals, discounts and coupon codes. Updated daily.'
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  amazon_url TEXT NOT NULL,
  asin TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  original_price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);

CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT,
  deal_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percent INT,
  coupon_code TEXT,
  affiliate_url TEXT,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'expired')),
  click_count INT DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_product ON deals(product_id);
CREATE INDEX idx_deals_published ON deals(is_published, status);
CREATE INDEX idx_deals_featured ON deals(is_featured);
CREATE INDEX idx_deals_expires ON deals(expires_at);
CREATE INDEX idx_deals_starts ON deals(starts_at);

CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(is_published, published_at);

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO pages (title, slug, content, meta_title, meta_description) VALUES
(
  'About Us',
  'about',
  '<h1>About DealHive</h1><p>We find and share the best Amazon deals and coupon codes every day so you can save money on products you love.</p>',
  'About Us | DealHive',
  'Learn more about DealHive and how we help you find the best Amazon deals.'
),
(
  'Contact Us',
  'contact',
  '<h1>Contact Us</h1><p>Have a question or want to suggest a deal? Email us at support@dealhive.example.com</p>',
  'Contact Us | DealHive',
  'Get in touch with the DealHive team.'
),
(
  'Privacy Policy',
  'privacy-policy',
  '<h1>Privacy Policy</h1><p>Last updated: October 2026</p><p>We respect your privacy. This site uses cookies for analytics and affiliate tracking. We do not sell personal data.</p>',
  'Privacy Policy | DealHive',
  'Privacy Policy for DealHive.'
),
(
  'Affiliate Disclosure',
  'affiliate-disclosure',
  '<h1>Affiliate Disclosure</h1><p>DealHive is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate we earn from qualifying purchases.</p><p>We may also participate in other affiliate programs. Prices and availability are accurate as of the date/time indicated and are subject to change.</p>',
  'Affiliate Disclosure | DealHive',
  'Affiliate Disclosure for DealHive – Amazon Associates.'
),
(
  'Terms & Conditions',
  'terms',
  '<h1>Terms & Conditions</h1><p>By using this website you agree to these terms. All deals are provided for informational purposes. We are not responsible for changes made by Amazon or merchants.</p>',
  'Terms & Conditions | DealHive',
  'Terms and Conditions for DealHive.'
);

CREATE OR REPLACE FUNCTION mark_expired_deals()
RETURNS void AS $$
BEGIN
  UPDATE deals
  SET status = 'expired', is_published = false, updated_at = NOW()
  WHERE expires_at IS NOT NULL
    AND expires_at < NOW()
    AND status != 'expired';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_deals_updated BEFORE UPDATE ON deals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published deals" ON deals FOR SELECT USING (is_published = true AND status = 'published');
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published pages" ON pages FOR SELECT USING (is_published = true);

CREATE POLICY "Admin all site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all deals" ON deals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin all pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
