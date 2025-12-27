export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg mb-4">ミートアンドイート</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            位置情報を使って中間地点のレストランを自動提案する、ログイン不要のイベント調整サービスです。
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm mb-4 text-gray-300">Credits & Data</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                Powered by <a href="https://mapsplatform.google.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Maps Platform</a>
                            </li>
                            <li>
                                Powered by <a href="https://webservice.recruit.co.jp/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hot Pepper Gourmet Search API</a>
                            </li>
                            <li>
                                Powered by <a href="http://express.heartrails.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">HeartRails Express</a>
                            </li>
                            <li>
                                Powered by <a href="https://nominatim.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Nominatim</a>
                            </li>
                            <li>
                                Data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">OpenStreetMap</a> contributors
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm mb-4 text-gray-300">サービスについて</h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            幹事の負担を減らし、みんなが集まりやすい場所で楽しい時間を過ごすためのツールです。
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    技育CAMPハッカソン vol.16
                    © 2025 ノリノリノリノリ. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
