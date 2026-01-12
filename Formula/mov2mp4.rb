class Mov2mp4 < Formula
  desc "Convert .mov files to lightweight .mp4"
  homepage "https://github.com/pleymor/mov2mp4"
  url "https://registry.npmjs.org/mov2mp4/-/mov2mp4-1.0.0.tgz"
  sha256 "eb28c5820a18bd780b2844fc9916ef583fd6f6f4d56772d7378bfacfde1b67d5"
  license "MIT"

  depends_on "node"
  depends_on "ffmpeg"

  def install
    system "npm", "install", *std_npm_args
    bin.install_symlink libexec.glob("bin/*")
  end

  test do
    assert_match "mov2mp4", shell_output("#{bin}/mov2mp4 --help")
    assert_match version.to_s, shell_output("#{bin}/mov2mp4 --version")
  end
end
